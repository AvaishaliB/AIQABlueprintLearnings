package com.salesforce.qa.tests;

import com.salesforce.qa.pages.LoginPage;
import com.salesforce.qa.utils.ConfigReader;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

@Epic("Salesforce Authentication")
@Feature("Valid Login")
public class ValidLoginTest extends BaseTest {

    private LoginPage loginPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void initPage() {
        try {
            loginPage = new LoginPage(driver);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize LoginPage: " + e.getMessage(), e);
        }
    }

    @Test(priority = 1)
    @Severity(SeverityLevel.BLOCKER)
    @Story("User logs in with valid credentials")
    @Description("Verify that a user can successfully log in with valid username and password")
    public void testValidLoginWithCorrectCredentials() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page is not displayed");
            loginPage.doLogin(ConfigReader.getValidUsername(), ConfigReader.getValidPassword());
            String currentUrl = loginPage.getCurrentUrl();
            Assert.assertFalse(
                    currentUrl.contains("login.salesforce.com"),
                    "Login failed — user was not redirected away from the login page. Current URL: " + currentUrl
            );
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("testValidLoginWithCorrectCredentials failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 2)
    @Severity(SeverityLevel.NORMAL)
    @Story("Login page elements are visible")
    @Description("Verify that the login page displays all required elements: username, password, and login button")
    public void testLoginPageElementsDisplayed() {
        try {
            Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page elements are not properly displayed");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("testLoginPageElementsDisplayed failed: " + e.getMessage(), e);
        }
    }
}
