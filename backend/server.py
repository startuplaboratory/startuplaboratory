from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'default_secret_key')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

security = HTTPBearer()

app = FastAPI(title="Execution Blueprint API")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ===================== PYDANTIC MODELS =====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    plan_type: str
    credits: int
    total_submissions: int
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class SubmissionCreate(BaseModel):
    idea_title: str
    problem_statement: str
    geography: str
    q1_paying_customers: str
    q2_urgency: str
    q3_market_size: str
    q4_validation_stage: str
    q5_competition_density: str
    q6_differentiation: str
    q7_switching_cost: str
    q8_geographic_scalability: str
    q9_revenue_model: str
    q10_marginal_cost: str
    q11_industry_experience: str
    q12_skill_alignment: str
    q13_weekly_time: str
    q14_network_access: str
    q15_budget_available: str
    q16_startup_cost: str
    q17_runway: str
    q18_mvp_complexity: str
    q19_customer_acquisition: str
    q20_time_to_market: str

class SubmissionResponse(BaseModel):
    id: str
    user_id: str
    idea_title: str
    problem_statement: str
    geography: str
    status: str
    created_at: str
    q1_paying_customers: str
    q2_urgency: str
    q3_market_size: str
    q4_validation_stage: str
    q5_competition_density: str
    q6_differentiation: str
    q7_switching_cost: str
    q8_geographic_scalability: str
    q9_revenue_model: str
    q10_marginal_cost: str
    q11_industry_experience: str
    q12_skill_alignment: str
    q13_weekly_time: str
    q14_network_access: str
    q15_budget_available: str
    q16_startup_cost: str
    q17_runway: str
    q18_mvp_complexity: str
    q19_customer_acquisition: str
    q20_time_to_market: str

class ScoreResponse(BaseModel):
    id: str
    submission_id: str
    market_score: float
    competition_score: float
    scalability_score: float
    founder_fit_score: float
    capital_score: float
    execution_score: float
    total_score: int
    risk_tier: str
    execution_mode: str
    expert_adjustment: int
    final_score: int
    generated_at: str
    warnings: List[Dict[str, str]]

class BlueprintRequestCreate(BaseModel):
    submission_id: str
    reason_for_request: str
    biggest_uncertainty: str
    budget_band: str
    timeline_to_start: str
    weekly_time_commitment: str
    solo_or_team: str
    contact_info: str

class ExpertNoteCreate(BaseModel):
    submission_id: str
    short_note: str
    detailed_note: Optional[str] = ""

class AdminScoreUpdate(BaseModel):
    market_score: Optional[float] = None
    competition_score: Optional[float] = None
    scalability_score: Optional[float] = None
    founder_fit_score: Optional[float] = None
    capital_score: Optional[float] = None
    execution_score: Optional[float] = None
    expert_adjustment: Optional[int] = None

class CreditUpdate(BaseModel):
    credits_to_add: int

# ===================== AUTH HELPERS =====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {"user_id": user_id, "exp": expiration}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ===================== SCORING ENGINE =====================

SCORING_MAP = {
    "q1_paying_customers": {"Yes": 4, "Somewhat": 2, "No": 0},
    "q2_urgency": {"Critical": 4, "Important": 2, "Nice-to-have": 0},
    "q3_market_size": {"Large": 4, "Medium": 2, "Niche": 1, "Undefined": 0},
    "q4_validation_stage": {"Paying users": 4, "Surveys": 3, "Informal feedback": 2, "None": 0},
    "q5_competition_density": {"Few": 4, "Moderate": 2, "Many": 0},
    "q6_differentiation": {"Strong": 4, "Somewhat": 2, "Weak": 0},
    "q7_switching_cost": {"Hard": 4, "Moderate": 2, "Easy": 0},
    "q8_geographic_scalability": {"Global": 4, "National": 2, "Local": 1},
    "q9_revenue_model": {"Recurring": 4, "Hybrid": 2, "One-time": 1},
    "q10_marginal_cost": {"Low": 4, "Moderate": 2, "High": 0},
    "q11_industry_experience": {"Strong": 4, "Basic": 2, "None": 0},
    "q12_skill_alignment": {"Strong": 4, "Some": 2, "None": 0},
    "q13_weekly_time": {"15+ hrs": 4, "5-15 hrs": 2, "<5 hrs": 0},
    "q14_network_access": {"Strong": 4, "Limited": 2, "None": 0},
    "q15_budget_available": {"High": 4, "Medium": 2, "Low": 1},
    "q16_startup_cost": {"Low": 4, "Medium": 2, "High": 0},
    "q17_runway": {"6+ months": 4, "3-6 months": 2, "<3 months": 0},
    "q18_mvp_complexity": {"Simple": 4, "Moderate": 2, "Complex": 0},
    "q19_customer_acquisition": {"Clear plan": 4, "Some idea": 2, "No plan": 0},
    "q20_time_to_market": {"<3 months": 4, "3-6 months": 2, "6+ months": 0},
}

def get_micro_score(question: str, answer: str) -> int:
    return SCORING_MAP.get(question, {}).get(answer, 0)

def calculate_scores(submission: dict) -> dict:
    # Market Demand (0-20): raw max 16, scale to 20
    market_raw = sum([
        get_micro_score("q1_paying_customers", submission.get("q1_paying_customers", "")),
        get_micro_score("q2_urgency", submission.get("q2_urgency", "")),
        get_micro_score("q3_market_size", submission.get("q3_market_size", "")),
        get_micro_score("q4_validation_stage", submission.get("q4_validation_stage", "")),
    ])
    market_score = round((market_raw / 16) * 20 * 2) / 2  # Round to nearest 0.5

    # Competition (0-15): raw max 12, scale to 15
    competition_raw = sum([
        get_micro_score("q5_competition_density", submission.get("q5_competition_density", "")),
        get_micro_score("q6_differentiation", submission.get("q6_differentiation", "")),
        get_micro_score("q7_switching_cost", submission.get("q7_switching_cost", "")),
    ])
    competition_score = round((competition_raw / 12) * 15 * 2) / 2

    # Scalability (0-15): raw max 12, scale to 15
    scalability_raw = sum([
        get_micro_score("q8_geographic_scalability", submission.get("q8_geographic_scalability", "")),
        get_micro_score("q9_revenue_model", submission.get("q9_revenue_model", "")),
        get_micro_score("q10_marginal_cost", submission.get("q10_marginal_cost", "")),
    ])
    scalability_score = round((scalability_raw / 12) * 15 * 2) / 2

    # Founder Fit (0-20): raw max 16, scale to 20
    founder_raw = sum([
        get_micro_score("q11_industry_experience", submission.get("q11_industry_experience", "")),
        get_micro_score("q12_skill_alignment", submission.get("q12_skill_alignment", "")),
        get_micro_score("q13_weekly_time", submission.get("q13_weekly_time", "")),
        get_micro_score("q14_network_access", submission.get("q14_network_access", "")),
    ])
    founder_fit_score = round((founder_raw / 16) * 20 * 2) / 2

    # Capital (0-15): raw max 12, scale to 15
    capital_raw = sum([
        get_micro_score("q15_budget_available", submission.get("q15_budget_available", "")),
        get_micro_score("q16_startup_cost", submission.get("q16_startup_cost", "")),
        get_micro_score("q17_runway", submission.get("q17_runway", "")),
    ])
    capital_score = round((capital_raw / 12) * 15 * 2) / 2

    # Execution (0-15): raw max 12, scale to 15
    execution_raw = sum([
        get_micro_score("q18_mvp_complexity", submission.get("q18_mvp_complexity", "")),
        get_micro_score("q19_customer_acquisition", submission.get("q19_customer_acquisition", "")),
        get_micro_score("q20_time_to_market", submission.get("q20_time_to_market", "")),
    ])
    execution_score = round((execution_raw / 12) * 15 * 2) / 2

    total_score = int(market_score + competition_score + scalability_score + founder_fit_score + capital_score + execution_score)

    # Risk Tier
    if total_score >= 80:
        risk_tier = "Strong Proceed"
        execution_mode = "Acceleration Mode"
    elif total_score >= 65:
        risk_tier = "Conditional Proceed"
        execution_mode = "Structured Build Mode"
    elif total_score >= 50:
        risk_tier = "Validation Required"
        execution_mode = "Validation Mode"
    else:
        risk_tier = "Elevated Execution Risk"
        execution_mode = "Structural Repair Mode"

    return {
        "market_score": market_score,
        "competition_score": competition_score,
        "scalability_score": scalability_score,
        "founder_fit_score": founder_fit_score,
        "capital_score": capital_score,
        "execution_score": execution_score,
        "total_score": total_score,
        "risk_tier": risk_tier,
        "execution_mode": execution_mode,
    }

def calculate_warnings(submission: dict, scores: dict) -> List[Dict[str, str]]:
    warnings = []
    
    # Validation Threshold Not Met
    market_pct = (scores["market_score"] / 20) * 100
    if market_pct < 40 or submission.get("q4_validation_stage") == "None":
        warnings.append({
            "type": "Validation Threshold Not Met",
            "message": "Validation evidence is insufficient — conduct structured customer interviews before capital deployment.",
            "severity": 40 - market_pct if market_pct < 40 else 30,
            "removal_condition": "Achieve market score above 40% (8/20) or provide paying user validation."
        })

    # Capital Pressure - High
    capital_pct = (scores["capital_score"] / 15) * 100
    budget_low = submission.get("q15_budget_available") == "Low"
    runway_short = submission.get("q17_runway") == "<3 months"
    if capital_pct < 40 or (budget_low and runway_short):
        warnings.append({
            "type": "Capital Pressure - High",
            "message": "Capital pressure is high — reduce scope or raise runway before aggressive build.",
            "severity": 40 - capital_pct if capital_pct < 40 else 25,
            "removal_condition": "Achieve capital score above 40% (6/15) or extend runway beyond 3 months."
        })

    # Founder Commitment Insufficient
    founder_pct = (scores["founder_fit_score"] / 20) * 100
    if founder_pct < 40 or submission.get("q13_weekly_time") == "<5 hrs":
        warnings.append({
            "type": "Founder Commitment Insufficient",
            "message": "Founder execution capacity is limited — consider co-founder or narrower scope.",
            "severity": 40 - founder_pct if founder_pct < 40 else 20,
            "removal_condition": "Achieve founder fit score above 40% (8/20) or commit 5+ hours weekly."
        })

    # Differentiation Ambiguity
    competition_pct = (scores["competition_score"] / 15) * 100
    if competition_pct < 40 or submission.get("q6_differentiation") == "Weak":
        warnings.append({
            "type": "Differentiation Ambiguity",
            "message": "Differentiation unclear — prioritize positioning and niche focus.",
            "severity": 40 - competition_pct if competition_pct < 40 else 15,
            "removal_condition": "Achieve competition score above 40% (6/15) or strengthen differentiation."
        })

    # Scalability Ceiling
    scalability_pct = (scores["scalability_score"] / 15) * 100
    one_time_high_cost = submission.get("q9_revenue_model") == "One-time" and submission.get("q10_marginal_cost") == "High"
    if scalability_pct < 40 or one_time_high_cost:
        warnings.append({
            "type": "Scalability Ceiling",
            "message": "Scalability appears limited — plan business model adjustments for long-term growth.",
            "severity": 40 - scalability_pct if scalability_pct < 40 else 10,
            "removal_condition": "Achieve scalability score above 40% (6/15) or adopt recurring revenue model."
        })

    # Sort by severity and return top 4
    warnings.sort(key=lambda x: x["severity"], reverse=True)
    return warnings[:4]

# ===================== 30-DAY TEMPLATES =====================

TEMPLATES = {
    "Acceleration Mode": {
        "week1": [
            "Finalize customer segment definition with specific demographics and psychographics",
            "Create one-page positioning document with clear value proposition",
            "Define MVP scope — cut features to minimal viable set",
            "Set up basic analytics and conversion tracking"
        ],
        "week2": [
            "Build lightweight MVP or high-fidelity landing page",
            "Set up acquisition funnel with clear call-to-action",
            "Implement basic user feedback collection mechanism",
            "Prepare paid acquisition test parameters"
        ],
        "week3": [
            "Run paid acquisition test or partnership outreach",
            "Gather conversion signals and user engagement data",
            "Conduct 5-10 user interviews with early signups",
            "Iterate on messaging based on initial feedback"
        ],
        "week4": [
            "Analyze cohort performance and conversion rates",
            "Decide to scale successful channels or optimize underperforming ones",
            "Prepare scaling plan if conversion threshold met",
            "Document learnings and update positioning"
        ],
        "guardrails": [
            "Do not increase feature set before validation",
            "Cap acquisition spend to 20% of available budget",
            "Require 5% conversion signal before scaling",
            "Maintain weekly review cadence"
        ],
        "checkpoint": "If landing conversion ≥ 5% OR 50 paying signups achieved → proceed to scaling phase. If not, return to Week 1 with revised positioning."
    },
    "Structured Build Mode": {
        "week1": [
            "Conduct 10 structured customer interviews using consistent script",
            "Refine problem statement based on interview findings",
            "Document pricing hypothesis with 3 price point options",
            "Map customer journey and identify key friction points"
        ],
        "week2": [
            "Narrow positioning to specific niche segment",
            "Build MVP outline or clickable prototype",
            "Test prototype with 5 potential customers",
            "Refine based on usability feedback"
        ],
        "week3": [
            "Run small validation test (preorders, pilot, or letter of intent)",
            "Target minimum 10 validation signals",
            "Document objections and concerns raised",
            "Prepare initial GTM A/B test variants"
        ],
        "week4": [
            "Review validation signals against threshold",
            "Prepare GTM test execution plan",
            "Define success metrics for next phase",
            "Make go/no-go decision on full build"
        ],
        "guardrails": [
            "Avoid building full product before pilot validation",
            "Cap development scope to core value proposition only",
            "Do not hire before product-market fit signals",
            "Preserve 60% of capital for post-validation phase"
        ],
        "checkpoint": "If 10+ validation signals AND positive unit economics projection → proceed to build. If validation signals < 10, extend validation by 2 weeks."
    },
    "Validation Mode": {
        "week1": [
            "Execute 10-20 discovery interviews with target segment",
            "Document jobs-to-be-done framework",
            "Identify top 3 pain points ranked by urgency",
            "Map competitive alternatives customers currently use"
        ],
        "week2": [
            "Create landing page with clear value proposition",
            "Set up smoke test to capture interest",
            "Drive traffic through organic and personal networks",
            "Target 100 landing page visitors minimum"
        ],
        "week3": [
            "Conduct low-cost pilot using manual/concierge approach",
            "Serve 3-5 customers manually to validate solution",
            "Gather detailed feedback on willingness to pay",
            "Document operational requirements"
        ],
        "week4": [
            "Evaluate metrics against threshold",
            "Decide: iterate on current approach or pivot",
            "If pivoting, identify new hypothesis",
            "If proceeding, define MVP requirements"
        ],
        "guardrails": [
            "Do not build product before validation complete",
            "Limit spend to customer research only",
            "Avoid commitment to vendors or partners",
            "Maintain flexibility to pivot"
        ],
        "checkpoint": "If smoke test conversion ≥ 3% AND 3+ customers willing to pay → proceed to Structured Build. If response below threshold → pivot to new hypothesis."
    },
    "Structural Repair Mode": {
        "week1": [
            "Identify weakest pillar from structural analysis",
            "Perform 5-10 focused interviews on weak area",
            "Document specific gaps and root causes",
            "Research comparable successful models"
        ],
        "week2": [
            "Redefine niche or adjust business model to address weakness",
            "Create revised hypothesis document",
            "Validate new direction with 5 informal conversations",
            "Update positioning accordingly"
        ],
        "week3": [
            "Create smallest testable experiment for new direction",
            "Execute low-cost test (landing page, survey, or outreach)",
            "Gather minimum 20 data points",
            "Document findings objectively"
        ],
        "week4": [
            "Evaluate test results honestly",
            "Decide: stop, pivot fundamentally, or rearchitect",
            "If proceeding, define clear next phase requirements",
            "Preserve remaining capital for validated path"
        ],
        "guardrails": [
            "Do not hire or expand team",
            "Do not commit capital to product development",
            "Preserve maximum runway for iteration",
            "Be willing to stop if fundamentals don't improve"
        ],
        "checkpoint": "If structural weakness addressed AND new validation positive → move to Validation Mode. If no improvement after 4 weeks → seriously consider stopping or major pivot."
    }
}

# ===================== AI PERSONALIZATION =====================

async def generate_personalized_insights(submission: dict, scores: dict) -> dict:
    """Generate 3 personalized lines using AI"""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            return get_fallback_insights(submission, scores)
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"blueprint-{uuid.uuid4()}",
            system_message="You are a strategic startup advisor. Provide brief, analytical insights. No hype or emotional language. Be direct and specific."
        ).with_model("openai", "gpt-5.2")
        
        prompt = f"""Based on this startup idea analysis, provide exactly 3 short personalized insights (1 sentence each):

Idea: {submission.get('idea_title', 'N/A')}
Problem: {submission.get('problem_statement', 'N/A')}
Geography: {submission.get('geography', 'N/A')}
Market Size: {submission.get('q3_market_size', 'N/A')}
Revenue Model: {submission.get('q9_revenue_model', 'N/A')}
Differentiation: {submission.get('q6_differentiation', 'N/A')}
Time to Market: {submission.get('q20_time_to_market', 'N/A')}
Total Score: {scores.get('total_score', 0)}/100

Provide:
1. Target audience refinement (who specifically should they focus on)
2. Differentiation emphasis (what unique angle to pursue)
3. Primary risk focus (what single risk to mitigate first)

Format as JSON: {{"audience": "...", "differentiation": "...", "risk": "..."}}"""

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        import json
        try:
            # Clean response and parse
            clean_response = response.strip()
            if clean_response.startswith("```"):
                clean_response = clean_response.split("```")[1]
                if clean_response.startswith("json"):
                    clean_response = clean_response[4:]
            insights = json.loads(clean_response)
            return insights
        except:
            return get_fallback_insights(submission, scores)
            
    except Exception as e:
        logger.error(f"AI personalization error: {e}")
        return get_fallback_insights(submission, scores)

def get_fallback_insights(submission: dict, scores: dict) -> dict:
    """Fallback insights when AI unavailable"""
    geography = submission.get('geography', 'your market')
    market_size = submission.get('q3_market_size', 'Medium')
    differentiation = submission.get('q6_differentiation', 'Somewhat')
    
    audience = f"Focus initial validation on early adopters in {geography} who have acute pain points."
    
    if differentiation == "Weak":
        diff_text = "Identify one unique capability or approach that competitors cannot easily replicate."
    elif differentiation == "Somewhat":
        diff_text = "Sharpen your differentiation by narrowing to a specific use case where you can dominate."
    else:
        diff_text = "Leverage your differentiation by making it central to all messaging and positioning."
    
    # Determine primary risk
    if scores.get("market_score", 0) < 10:
        risk_text = "Prioritize market validation — your current evidence is insufficient for confident execution."
    elif scores.get("capital_score", 0) < 8:
        risk_text = "Address capital constraints first — extend runway or reduce scope before building."
    elif scores.get("founder_fit_score", 0) < 10:
        risk_text = "Increase execution capacity — consider co-founder or narrower scope."
    else:
        risk_text = "Monitor competition dynamics closely — maintain positioning clarity."
    
    return {
        "audience": audience,
        "differentiation": diff_text,
        "risk": risk_text
    }

# ===================== AUTH ENDPOINTS =====================

@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "full_name": user_data.full_name,
        "plan_type": "free",
        "credits": 1,
        "total_submissions": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_admin": False
    }
    await db.users.insert_one(user)
    
    token = create_token(user_id)
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        plan_type=user["plan_type"],
        credits=user["credits"],
        total_submissions=user["total_submissions"],
        created_at=user["created_at"]
    )
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"])
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        plan_type=user["plan_type"],
        credits=user["credits"],
        total_submissions=user["total_submissions"],
        created_at=user["created_at"]
    )
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        plan_type=current_user["plan_type"],
        credits=current_user["credits"],
        total_submissions=current_user["total_submissions"],
        created_at=current_user["created_at"]
    )

# ===================== SUBMISSION ENDPOINTS =====================

@api_router.post("/submissions", response_model=SubmissionResponse)
async def create_submission(data: SubmissionCreate, current_user: dict = Depends(get_current_user)):
    submission_id = str(uuid.uuid4())
    submission = {
        "id": submission_id,
        "user_id": current_user["id"],
        "idea_title": data.idea_title,
        "problem_statement": data.problem_statement,
        "geography": data.geography,
        "status": "draft",
        "created_at": datetime.now(timezone.utc).isoformat(),
        **data.model_dump(exclude={"idea_title", "problem_statement", "geography"})
    }
    await db.submissions.insert_one(submission)
    
    # Increment total submissions
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$inc": {"total_submissions": 1}}
    )
    
    return SubmissionResponse(**{k: v for k, v in submission.items() if k != "_id"})

@api_router.get("/submissions", response_model=List[SubmissionResponse])
async def get_user_submissions(current_user: dict = Depends(get_current_user)):
    submissions = await db.submissions.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return [SubmissionResponse(**s) for s in submissions]

@api_router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
async def get_submission(submission_id: str, current_user: dict = Depends(get_current_user)):
    submission = await db.submissions.find_one(
        {"id": submission_id, "user_id": current_user["id"]},
        {"_id": 0}
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return SubmissionResponse(**submission)

# ===================== SCORING ENDPOINTS =====================

@api_router.post("/submissions/{submission_id}/generate-score", response_model=ScoreResponse)
async def generate_score(submission_id: str, current_user: dict = Depends(get_current_user)):
    # Check credits
    if current_user["credits"] <= 0:
        raise HTTPException(status_code=402, detail="No credits remaining. Upgrade to continue.")
    
    # Get submission
    submission = await db.submissions.find_one(
        {"id": submission_id, "user_id": current_user["id"]},
        {"_id": 0}
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Check if already scored (prevent double generation)
    existing_score = await db.scores.find_one({"submission_id": submission_id}, {"_id": 0})
    if existing_score:
        raise HTTPException(status_code=400, detail="Score already generated for this submission")
    
    # Deduct credit
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$inc": {"credits": -1}}
    )
    
    # Log credit usage
    credit_log = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "submission_id": submission_id,
        "credits_used": 1,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.credit_logs.insert_one(credit_log)
    
    # Calculate scores
    scores = calculate_scores(submission)
    warnings = calculate_warnings(submission, scores)
    
    # Generate personalized insights
    insights = await generate_personalized_insights(submission, scores)
    
    # Create score record
    score_id = str(uuid.uuid4())
    score_record = {
        "id": score_id,
        "submission_id": submission_id,
        **scores,
        "expert_adjustment": 0,
        "final_score": scores["total_score"],
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "warnings": warnings,
        "personalized_insights": insights
    }
    await db.scores.insert_one(score_record)
    
    # Update submission status
    await db.submissions.update_one(
        {"id": submission_id},
        {"$set": {"status": "scored"}}
    )
    
    return ScoreResponse(**{k: v for k, v in score_record.items() if k not in ["_id", "personalized_insights"]})

@api_router.get("/submissions/{submission_id}/score")
async def get_score(submission_id: str, current_user: dict = Depends(get_current_user)):
    # Verify ownership
    submission = await db.submissions.find_one(
        {"id": submission_id, "user_id": current_user["id"]},
        {"_id": 0}
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    score = await db.scores.find_one({"submission_id": submission_id}, {"_id": 0})
    if not score:
        raise HTTPException(status_code=404, detail="Score not generated yet")
    
    return score

@api_router.get("/submissions/{submission_id}/blueprint")
async def get_blueprint(submission_id: str, current_user: dict = Depends(get_current_user)):
    """Get full blueprint with 30-day plan"""
    submission = await db.submissions.find_one(
        {"id": submission_id, "user_id": current_user["id"]},
        {"_id": 0}
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    score = await db.scores.find_one({"submission_id": submission_id}, {"_id": 0})
    if not score:
        raise HTTPException(status_code=404, detail="Score not generated yet")
    
    execution_mode = score.get("execution_mode", "Validation Mode")
    template = TEMPLATES.get(execution_mode, TEMPLATES["Validation Mode"])
    
    # Get expert note if exists
    expert_note = await db.expert_notes.find_one({"submission_id": submission_id}, {"_id": 0})
    
    return {
        "submission": submission,
        "score": score,
        "template": template,
        "personalized_insights": score.get("personalized_insights", {}),
        "expert_note": expert_note
    }

# ===================== BLUEPRINT REQUEST ENDPOINTS =====================

@api_router.post("/blueprint-requests")
async def create_blueprint_request(data: BlueprintRequestCreate, current_user: dict = Depends(get_current_user)):
    # Verify submission ownership
    submission = await db.submissions.find_one(
        {"id": data.submission_id, "user_id": current_user["id"]},
        {"_id": 0}
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    score = await db.scores.find_one({"submission_id": data.submission_id}, {"_id": 0})
    
    request_id = str(uuid.uuid4())
    request_record = {
        "id": request_id,
        "user_id": current_user["id"],
        "submission_id": data.submission_id,
        "idea_title": submission.get("idea_title"),
        "total_score": score.get("total_score") if score else None,
        "execution_mode": score.get("execution_mode") if score else None,
        "reason_for_request": data.reason_for_request,
        "biggest_uncertainty": data.biggest_uncertainty,
        "budget_band": data.budget_band,
        "timeline_to_start": data.timeline_to_start,
        "weekly_time_commitment": data.weekly_time_commitment,
        "solo_or_team": data.solo_or_team,
        "contact_info": data.contact_info,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.blueprint_requests.insert_one(request_record)
    
    # Update submission status
    await db.submissions.update_one(
        {"id": data.submission_id},
        {"$set": {"status": "under_review"}}
    )
    
    return {"message": "Application submitted successfully", "request_id": request_id}

# ===================== ADMIN ENDPOINTS =====================

async def verify_admin(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@api_router.get("/admin/submissions")
async def admin_get_all_submissions(admin: dict = Depends(verify_admin)):
    submissions = await db.submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    # Enrich with scores and user info
    for sub in submissions:
        score = await db.scores.find_one({"submission_id": sub["id"]}, {"_id": 0})
        sub["score"] = score
        user = await db.users.find_one({"id": sub["user_id"]}, {"_id": 0, "password": 0})
        sub["user"] = user
    
    return submissions

@api_router.get("/admin/users")
async def admin_get_all_users(admin: dict = Depends(verify_admin)):
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    return users

@api_router.put("/admin/scores/{submission_id}")
async def admin_update_score(submission_id: str, data: AdminScoreUpdate, admin: dict = Depends(verify_admin)):
    score = await db.scores.find_one({"submission_id": submission_id})
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    
    if update_data:
        # Recalculate total and final score if pillar scores updated
        current_score = await db.scores.find_one({"submission_id": submission_id}, {"_id": 0})
        
        new_market = update_data.get("market_score", current_score["market_score"])
        new_competition = update_data.get("competition_score", current_score["competition_score"])
        new_scalability = update_data.get("scalability_score", current_score["scalability_score"])
        new_founder = update_data.get("founder_fit_score", current_score["founder_fit_score"])
        new_capital = update_data.get("capital_score", current_score["capital_score"])
        new_execution = update_data.get("execution_score", current_score["execution_score"])
        new_adjustment = update_data.get("expert_adjustment", current_score["expert_adjustment"])
        
        new_total = int(new_market + new_competition + new_scalability + new_founder + new_capital + new_execution)
        new_final = new_total + new_adjustment
        
        # Update risk tier
        if new_final >= 80:
            risk_tier = "Strong Proceed"
            execution_mode = "Acceleration Mode"
        elif new_final >= 65:
            risk_tier = "Conditional Proceed"
            execution_mode = "Structured Build Mode"
        elif new_final >= 50:
            risk_tier = "Validation Required"
            execution_mode = "Validation Mode"
        else:
            risk_tier = "Elevated Execution Risk"
            execution_mode = "Structural Repair Mode"
        
        update_data["total_score"] = new_total
        update_data["final_score"] = new_final
        update_data["risk_tier"] = risk_tier
        update_data["execution_mode"] = execution_mode
        
        await db.scores.update_one(
            {"submission_id": submission_id},
            {"$set": update_data}
        )
        
        # Log edit
        edit_log = {
            "id": str(uuid.uuid4()),
            "submission_id": submission_id,
            "admin_id": admin["id"],
            "changes": update_data,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.score_edit_logs.insert_one(edit_log)
    
    return {"message": "Score updated successfully"}

@api_router.post("/admin/expert-notes")
async def admin_add_expert_note(data: ExpertNoteCreate, admin: dict = Depends(verify_admin)):
    note_id = str(uuid.uuid4())
    note = {
        "id": note_id,
        "submission_id": data.submission_id,
        "short_note": data.short_note,
        "detailed_note": data.detailed_note,
        "created_by": admin["id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Upsert - replace if exists
    await db.expert_notes.update_one(
        {"submission_id": data.submission_id},
        {"$set": note},
        upsert=True
    )
    
    return {"message": "Expert note added successfully"}

@api_router.put("/admin/users/{user_id}/credits")
async def admin_update_credits(user_id: str, data: CreditUpdate, admin: dict = Depends(verify_admin)):
    result = await db.users.update_one(
        {"id": user_id},
        {"$inc": {"credits": data.credits_to_add}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Log credit addition
    credit_log = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "submission_id": None,
        "credits_used": -data.credits_to_add,  # Negative means added
        "admin_id": admin["id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.credit_logs.insert_one(credit_log)
    
    return {"message": f"Added {data.credits_to_add} credits to user"}

@api_router.put("/admin/submissions/{submission_id}/status")
async def admin_update_submission_status(submission_id: str, status: str, admin: dict = Depends(verify_admin)):
    valid_statuses = ["draft", "submitted", "scored", "under_review", "completed"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = await db.submissions.update_one(
        {"id": submission_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return {"message": f"Status updated to {status}"}

@api_router.get("/admin/blueprint-requests")
async def admin_get_blueprint_requests(admin: dict = Depends(verify_admin)):
    requests = await db.blueprint_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return requests

@api_router.get("/admin/credit-logs")
async def admin_get_credit_logs(admin: dict = Depends(verify_admin)):
    logs = await db.credit_logs.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return logs

# ===================== HEALTH CHECK =====================

@api_router.get("/")
async def root():
    return {"message": "Execution Blueprint API", "status": "healthy"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# ===================== APP SETUP =====================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Create admin user on startup
@app.on_event("startup")
async def create_admin_user():
    admin_exists = await db.users.find_one({"email": "admin@executionblueprint.com"})
    if not admin_exists:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "admin@executionblueprint.com",
            "password": hash_password("admin123"),
            "full_name": "Admin User",
            "plan_type": "admin",
            "credits": 999,
            "total_submissions": 0,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_admin": True
        }
        await db.users.insert_one(admin_user)
        logger.info("Admin user created: admin@executionblueprint.com / admin123")
