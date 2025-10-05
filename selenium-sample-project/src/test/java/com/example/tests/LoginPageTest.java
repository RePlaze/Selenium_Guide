package com.example.tests;

import com.example.pages.HomePage;
import com.example.pages.LoginPage;
import com.example.utils.BaseTest;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class LoginPageTest extends BaseTest {
    private LoginPage loginPage;

    @BeforeMethod
    public void setUpPage() {
        loginPage = new LoginPage(driver);
        loginPage.navigateToLoginPage();
    }

    @Test(priority = 1)
    public void testSuccessfulLogin() {
        HomePage homePage = loginPage.login("valid@example.com", "ValidPassword123");
        
        Assert.assertTrue(homePage.isUserLoggedIn(), "User is not logged in");
        Assert.assertEquals(homePage.getWelcomeMessage(), "Welcome, User!", 
            "Welcome message is incorrect");
    }

    @Test(priority = 2)
    public void testInvalidLogin() {
        loginPage.login("invalid@example.com", "WrongPassword");
        
        Assert.assertTrue(loginPage.isErrorMessageDisplayed(), 
            "Error message is not displayed");
        Assert.assertEquals(loginPage.getErrorMessageText(), 
            "Invalid email or password", "Error message text is incorrect");
        Assert.assertTrue(loginPage.isOnLoginPage(), 
            "User was redirected from login page");
    }

    @Test(priority = 3)
    public void testEmptyCredentials() {
        loginPage.clickLoginButton();
        
        Assert.assertTrue(loginPage.isErrorMessageDisplayed(), 
            "Error message is not displayed for empty credentials");
        Assert.assertTrue(loginPage.getErrorMessageText().contains("required"), 
            "Error message doesn't mention required fields");
    }

    @Test(priority = 4)
    public void testRememberMeFunctionality() {
        HomePage homePage = loginPage.loginWithRememberMe(
            "remember@example.com", "Password123"
        );
        
        Assert.assertTrue(homePage.isUserLoggedIn(), "User is not logged in");
        
        // Additional verification for remember me cookie could be added here
        driver.manage().getCookies().stream()
            .anyMatch(cookie -> cookie.getName().equals("remember_token"));
    }

    @Test(priority = 5)
    public void testForgotPasswordLink() {
        loginPage.clickForgotPassword();
        
        Assert.assertTrue(driver.getCurrentUrl().contains("/forgot-password"), 
            "Not redirected to forgot password page");
    }
}