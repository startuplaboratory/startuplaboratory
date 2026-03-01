import requests
import sys
import json
from datetime import datetime

class ExecutionBlueprintAPITester:
    def __init__(self, base_url="https://startup-validator-10.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.submission_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, use_admin=False):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        # Use admin token if specified and available
        if use_admin and self.admin_token:
            headers['Authorization'] = f'Bearer {self.admin_token}'
        elif self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH ENDPOINTS")
        print("="*50)
        
        self.run_test("Root endpoint", "GET", "", 200)
        self.run_test("Health check", "GET", "health", 200)

    def test_user_signup(self):
        """Test user signup"""
        print("\n" + "="*50)
        print("TESTING USER AUTHENTICATION")
        print("="*50)
        
        timestamp = datetime.now().strftime('%H%M%S')
        test_user_data = {
            "email": f"test_user_{timestamp}@example.com",
            "password": "TestPass123!",
            "full_name": "Test User"
        }
        
        success, response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup",
            200,
            data=test_user_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"   User ID: {self.user_id}")
            print(f"   Credits: {response['user']['credits']}")
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        login_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        
        success, response = self.run_test(
            "User Login (fallback)",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        return success

    def test_admin_login(self):
        """Test admin login"""
        admin_data = {
            "email": "admin@executionblueprint.com",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=admin_data
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"   Admin logged in successfully")
            return True
        return False

    def test_get_user_profile(self):
        """Test getting user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_submission_flow(self):
        """Test complete submission flow"""
        print("\n" + "="*50)
        print("TESTING SUBMISSION FLOW")
        print("="*50)
        
        # Create submission
        submission_data = {
            "idea_title": "AI-powered Restaurant Inventory Management",
            "problem_statement": "Restaurants waste 30% of inventory due to poor tracking and prediction systems.",
            "geography": "United States",
            "q1_paying_customers": "Somewhat",
            "q2_urgency": "Important",
            "q3_market_size": "Large",
            "q4_validation_stage": "Surveys",
            "q5_competition_density": "Moderate",
            "q6_differentiation": "Strong",
            "q7_switching_cost": "Moderate",
            "q8_geographic_scalability": "National",
            "q9_revenue_model": "Recurring",
            "q10_marginal_cost": "Low",
            "q11_industry_experience": "Basic",
            "q12_skill_alignment": "Strong",
            "q13_weekly_time": "15+ hrs",
            "q14_network_access": "Limited",
            "q15_budget_available": "Medium",
            "q16_startup_cost": "Medium",
            "q17_runway": "6+ months",
            "q18_mvp_complexity": "Moderate",
            "q19_customer_acquisition": "Some idea",
            "q20_time_to_market": "3-6 months"
        }
        
        success, response = self.run_test(
            "Create Submission",
            "POST",
            "submissions",
            200,
            data=submission_data
        )
        
        if success and 'id' in response:
            self.submission_id = response['id']
            print(f"   Submission ID: {self.submission_id}")
        
        # Get user submissions
        self.run_test(
            "Get User Submissions",
            "GET",
            "submissions",
            200
        )
        
        # Get specific submission
        if self.submission_id:
            self.run_test(
                "Get Specific Submission",
                "GET",
                f"submissions/{self.submission_id}",
                200
            )
        
        return success

    def test_scoring_flow(self):
        """Test score generation"""
        print("\n" + "="*50)
        print("TESTING SCORING FLOW")
        print("="*50)
        
        if not self.submission_id:
            print("❌ No submission ID available for scoring")
            return False
        
        # Generate score
        success, response = self.run_test(
            "Generate Score",
            "POST",
            f"submissions/{self.submission_id}/generate-score",
            200
        )
        
        if success:
            print(f"   Total Score: {response.get('total_score', 'N/A')}")
            print(f"   Risk Tier: {response.get('risk_tier', 'N/A')}")
            print(f"   Execution Mode: {response.get('execution_mode', 'N/A')}")
        
        # Get score
        self.run_test(
            "Get Score",
            "GET",
            f"submissions/{self.submission_id}/score",
            200
        )
        
        # Get blueprint
        self.run_test(
            "Get Blueprint",
            "GET",
            f"submissions/{self.submission_id}/blueprint",
            200
        )
        
        return success

    def test_blueprint_request(self):
        """Test blueprint request submission"""
        print("\n" + "="*50)
        print("TESTING BLUEPRINT REQUEST")
        print("="*50)
        
        if not self.submission_id:
            print("❌ No submission ID available for blueprint request")
            return False
        
        blueprint_data = {
            "submission_id": self.submission_id,
            "reason_for_request": "Need deeper market analysis and competitive positioning",
            "biggest_uncertainty": "Customer acquisition cost and scalability",
            "budget_band": "$10k-$50k",
            "timeline_to_start": "Within 1 month",
            "weekly_time_commitment": "20+ hours",
            "solo_or_team": "Solo founder",
            "contact_info": "test@example.com"
        }
        
        success, response = self.run_test(
            "Create Blueprint Request",
            "POST",
            "blueprint-requests",
            200,
            data=blueprint_data
        )
        
        return success

    def test_admin_functions(self):
        """Test admin panel functions"""
        print("\n" + "="*50)
        print("TESTING ADMIN FUNCTIONS")
        print("="*50)
        
        if not self.admin_token:
            print("❌ No admin token available")
            return False
        
        # Get all submissions
        self.run_test(
            "Admin - Get All Submissions",
            "GET",
            "admin/submissions",
            200,
            use_admin=True
        )
        
        # Get all users
        self.run_test(
            "Admin - Get All Users",
            "GET",
            "admin/users",
            200,
            use_admin=True
        )
        
        # Get blueprint requests
        self.run_test(
            "Admin - Get Blueprint Requests",
            "GET",
            "admin/blueprint-requests",
            200,
            use_admin=True
        )
        
        # Get credit logs
        self.run_test(
            "Admin - Get Credit Logs",
            "GET",
            "admin/credit-logs",
            200,
            use_admin=True
        )
        
        # Test score update (if we have a submission)
        if self.submission_id:
            score_update = {
                "market_score": 15.0,
                "expert_adjustment": 5
            }
            self.run_test(
                "Admin - Update Score",
                "PUT",
                f"admin/scores/{self.submission_id}",
                200,
                data=score_update,
                use_admin=True
            )
        
        # Test adding credits (if we have a user)
        if self.user_id:
            credit_update = {
                "credits_to_add": 2
            }
            self.run_test(
                "Admin - Add Credits",
                "PUT",
                f"admin/users/{self.user_id}/credits",
                200,
                data=credit_update,
                use_admin=True
            )
        
        # Test expert note
        if self.submission_id:
            expert_note = {
                "submission_id": self.submission_id,
                "short_note": "Strong technical execution capability, focus on market validation",
                "detailed_note": "Detailed analysis shows good founder-market fit..."
            }
            self.run_test(
                "Admin - Add Expert Note",
                "POST",
                "admin/expert-notes",
                200,
                data=expert_note,
                use_admin=True
            )
        
        return True

    def test_error_cases(self):
        """Test error handling"""
        print("\n" + "="*50)
        print("TESTING ERROR CASES")
        print("="*50)
        
        # Test duplicate signup
        duplicate_user = {
            "email": "admin@executionblueprint.com",  # Already exists
            "password": "test123",
            "full_name": "Duplicate User"
        }
        self.run_test(
            "Duplicate Email Signup",
            "POST",
            "auth/signup",
            400,
            data=duplicate_user
        )
        
        # Test invalid login
        invalid_login = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,
            data=invalid_login
        )
        
        # Test unauthorized access
        old_token = self.token
        self.token = None
        self.run_test(
            "Unauthorized Access",
            "GET",
            "submissions",
            401
        )
        self.token = old_token
        
        # Test non-existent submission
        self.run_test(
            "Non-existent Submission",
            "GET",
            "submissions/nonexistent-id",
            404
        )

def main():
    print("🚀 Starting Execution Blueprint API Tests")
    print("=" * 60)
    
    tester = ExecutionBlueprintAPITester()
    
    # Run all test suites
    try:
        tester.test_health_check()
        
        if tester.test_user_signup():
            tester.test_get_user_profile()
            
            if tester.test_submission_flow():
                tester.test_scoring_flow()
                tester.test_blueprint_request()
        
        tester.test_user_login()  # Test fallback login
        
        if tester.test_admin_login():
            tester.test_admin_functions()
        
        tester.test_error_cases()
        
    except Exception as e:
        print(f"\n💥 Test suite failed with error: {e}")
        return 1
    
    # Print final results
    print("\n" + "="*60)
    print("📊 FINAL TEST RESULTS")
    print("="*60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())