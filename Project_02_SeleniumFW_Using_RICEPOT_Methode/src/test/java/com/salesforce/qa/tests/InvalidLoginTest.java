package com.salesforce.qa.tests;

import com.salesforce.qa.pages.LoginPage;
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
@Feature("Invalid Login")
public class InvalidLoginTest extends BaseTest {

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
    @Severity(SeverityLevel.CRITICAL)
    @Story("User attempts login with invalid password")
    @Description("Verify that an error message is displayed when a valid username and an incorrect password are entered")
    public void testInvalidPassword() {
        try {
            loginPage.doLogin("testuser@salesforce.com", "WrongPassword123");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Error message is not displayed for invalid password");
            String errorText = loginPage.getErrorMessage();
            Assert.assertFalse(errorText.isEmpty(), "Error message text is empty");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("testInvalidPassword failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 2)
    @Severity(SeverityLevel.CRITICAL)
    @Story("User attempts login with invalid username")
    @Description("Verify that an error message is displayed when an incorrect username and any password are entered")
    public void testInvalidUsername() {
        try {
            loginPage.doLogin("invaliduser@nonexistent.com", "SomePassword456");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Error message is not displayed for invalid username");
            String errorText = loginPage.getErrorMessage();
            Assert.assertFalse(errorText.isEmpty(), "Error message text is empty");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("testInvalidUsername failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 3)
    @Severity(SeverityLevel.CRITICAL)
    @Story("User attempts login with empty credentials")
    @Description("Verify that an error message is displayed when both username and password fields are left empty")
    public void testEmptyCredentials() {
        try {
            loginPage.doLogin("", "");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Error message is not displayed for empty credentials");
            String errorText = loginPage.getErrorMessage();
            Assert.assertFalse(errorText.isEmpty(), "Error message text is empty");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("testEmptyCredentials failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 4)
    @Severity(SeverityLevel.NORMAL)
    @Story("User attempts login with empty password")
    @Description("Verify that an error message is displayed when username is provided but password is left empty")
    public void testEmptyPassword() {
        try {
            loginPage.doLogin("testuser@salesforce.com", "");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Error message is not displayed for empty password");
            String errorText = loginPage.getErrorMessage();
            Assert.assertFalse(errorText.isEmpty(), "Error message text is empty");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("testEmptyPassword failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 5)
    @Severity(SeverityLevel.NORMAL)
    @Story("User attempts login with empty username")
    @Description("Verify that an error message is displayed when password is provided but username is left empty")
    public void testEmptyUsername() {
        try {
            loginPage.doLogin("", "SomePassword789");
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Error message is not displayed for empty username");
            String errorText = loginPage.getErrorMessage();
            Assert.assertFalse(errorText.isEmpty(), "Error message text is empty");
        } catch (AssertionError e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("testEmptyUsername failed: " + e.getMessage(), e);
        }
    }
}
