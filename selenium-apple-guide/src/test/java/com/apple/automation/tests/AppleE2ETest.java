package com.apple.automation.tests;

import com.apple.automation.core.BaseTest;
import com.apple.automation.pages.AppleBagPage;
import com.apple.automation.pages.AppleHomePage;
import com.apple.automation.pages.AppleSearchResultsPage;
import io.qameta.allure.*;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

import static org.assertj.core.api.Assertions.*;

/**
 * Example E2E test for Apple website demonstrating best practices:
 * - Page Object Model (POM)
 * - Parametric tests with DataProvider
 * - Atomic test design
 * - Comprehensive logging
 * - Allure reporting integration
 * - Clean, readable code
 */
@Epic("Apple Website")
@Feature("Product Search and Navigation")
public class AppleE2ETest extends BaseTest {
    
    private AppleHomePage homePage;
    private AppleSearchResultsPage searchResultsPage;
    private AppleBagPage bagPage;
    
    @BeforeMethod(alwaysRun = true)
    public void initializePages() {
        homePage = new AppleHomePage(driver);
    }
    
    @Test(
        groups = {"smoke", "search"},
        description = "Verify user can search for products and view results"
    )
    @Story("Product Search")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Test validates that search functionality works correctly and returns relevant results")
    public void testProductSearchFunctionality() {
        step("Search for iPhone", () -> {
            searchResultsPage = homePage.search("iPhone");
        });
        
        step("Verify search results", () -> {
            assertThat(searchResultsPage.getResultsCount())
                .as("Search results for 'iPhone' should be displayed")
                .isGreaterThan(0);
            
            assertThat(searchResultsPage.getFirstResultTitle())
                .as("First result should contain search term")
                .containsIgnoringCase("iPhone");
        });
        
        step("Log search results", () -> {
            int resultsCount = searchResultsPage.getResultsCount();
            logger.info("Found {} results for 'iPhone'", resultsCount);
            addAllureInfo("Results Count", String.valueOf(resultsCount));
        });
    }
    
    @Test(
        dataProvider = "searchTerms",
        groups = {"regression", "search"},
        description = "Verify search works for multiple product types"
    )
    @Story("Parametric Product Search")
    @Severity(SeverityLevel.NORMAL)
    public void testParametricProductSearch(String searchTerm, int minExpectedResults) {
        step(String.format("Search for '%s'", searchTerm), () -> {
            searchResultsPage = homePage.search(searchTerm);
        });
        
        step("Verify minimum results", () -> {
            int actualResults = searchResultsPage.getResultsCount();
            
            assertThat(actualResults)
                .as("Search for '%s' should return at least %d results", 
                    searchTerm, minExpectedResults)
                .isGreaterThanOrEqualTo(minExpectedResults);
            
            logger.info("Search '{}' returned {} results", searchTerm, actualResults);
        });
        
        step("Verify result relevance", () -> {
            assertThat(searchResultsPage.getResultTitles())
                .as("At least one result should contain the search term")
                .anyMatch(title -> title.toLowerCase().contains(searchTerm.toLowerCase()));
        });
    }
    
    @Test(
        groups = {"smoke", "navigation"},
        description = "Verify main navigation menu functionality"
    )
    @Story("Navigation Menu")
    @Severity(SeverityLevel.CRITICAL)
    public void testNavigationMenuItems() {
        SoftAssert softAssert = new SoftAssert();
        
        step("Verify Apple logo is clickable", () -> {
            homePage.clickAppleLogo();
            assertThat(driver.getCurrentUrl())
                .as("Clicking Apple logo should stay on homepage")
                .contains("apple.com");
        });
        
        step("Verify navigation items are present", () -> {
            var navItems = homePage.getNavigationItems();
            
            softAssert.assertTrue(navItems.contains("Mac"), 
                "Mac should be in navigation");
            softAssert.assertTrue(navItems.contains("iPad"), 
                "iPad should be in navigation");
            softAssert.assertTrue(navItems.contains("iPhone"), 
                "iPhone should be in navigation");
            softAssert.assertTrue(navItems.contains("Watch"), 
                "Watch should be in navigation");
            
            logger.info("Navigation items: {}", navItems);
            addAllureInfo("Navigation Items", String.join(", ", navItems));
        });
        
        softAssert.assertAll();
    }
    
    @Test(
        groups = {"smoke", "bag"},
        description = "Verify shopping bag displays empty state correctly"
    )
    @Story("Shopping Bag")
    @Severity(SeverityLevel.NORMAL)
    @Description("Test validates that empty shopping bag shows appropriate message")
    public void testEmptyShoppingBag() {
        step("Open shopping bag", () -> {
            bagPage = homePage.openBag();
        });
        
        step("Verify empty bag state", () -> {
            assertThat(bagPage.isBagEmpty())
                .as("Bag should be empty initially")
                .isTrue();
            
            assertThat(bagPage.getEmptyBagMessage())
                .as("Empty bag should show appropriate message")
                .containsIgnoringCase("bag is empty");
        });
        
        step("Verify continue shopping option", () -> {
            // This would typically click a "Continue Shopping" button
            // For demo purposes, we'll navigate back
            homePage = bagPage.continueShopping();
            assertThat(homePage.isPageLoaded())
                .as("Should return to homepage")
                .isTrue();
        });
    }
    
    @Test(
        groups = {"regression", "search"},
        description = "Verify no results scenario is handled gracefully"
    )
    @Story("Search Edge Cases")
    @Severity(SeverityLevel.MINOR)
    public void testSearchWithNoResults() {
        String randomSearchTerm = "xyzabc123randomsearch";
        
        step(String.format("Search for non-existent product: %s", randomSearchTerm), () -> {
            searchResultsPage = homePage.search(randomSearchTerm);
        });
        
        step("Verify no results message", () -> {
            assertThat(searchResultsPage.isNoResultsDisplayed())
                .as("No results message should be displayed")
                .isTrue();
            
            String noResultsMessage = searchResultsPage.getNoResultsMessage();
            assertThat(noResultsMessage)
                .as("No results message should be user-friendly")
                .isNotEmpty();
            
            logger.info("No results message: {}", noResultsMessage);
        });
        
        step("Verify search suggestions", () -> {
            var suggestions = searchResultsPage.getSearchSuggestions();
            logger.info("Search suggestions: {}", suggestions);
            
            // Suggestions might not always be available
            if (!suggestions.isEmpty()) {
                addAllureInfo("Suggestions", String.join(", ", suggestions));
            }
        });
    }
    
    @Test(
        groups = {"regression", "performance"},
        description = "Verify page load performance"
    )
    @Story("Performance")
    @Severity(SeverityLevel.MINOR)
    public void testPageLoadPerformance() {
        long startTime = System.currentTimeMillis();
        
        step("Measure homepage load time", () -> {
            driver.navigate().refresh();
            homePage = new AppleHomePage(driver);
        });
        
        long loadTime = System.currentTimeMillis() - startTime;
        
        step("Verify load time is acceptable", () -> {
            assertThat(loadTime)
                .as("Homepage should load within 5 seconds")
                .isLessThan(5000);
            
            logger.info("Homepage loaded in {} ms", loadTime);
            addAllureInfo("Load Time", loadTime + " ms");
        });
    }
    
    /**
     * Data provider for parametric search tests.
     */
    @DataProvider(name = "searchTerms")
    public Object[][] searchTerms() {
        return new Object[][] {
            {"MacBook", 3},
            {"iPad", 3},
            {"Apple Watch", 2},
            {"AirPods", 2},
            {"iPhone 15", 1}
        };
    }
    
    /**
     * Example of a test with retry analyzer.
     * Useful for handling occasional flakiness.
     */
    @Test(
        groups = {"flaky"},
        description = "Example test with retry mechanism",
        retryAnalyzer = com.apple.automation.utils.RetryAnalyzer.class
    )
    @Story("Retry Mechanism Demo")
    @Severity(SeverityLevel.TRIVIAL)
    public void testWithRetryMechanism() {
        step("Perform action that might be flaky", () -> {
            // This is where you'd put code that occasionally fails
            // For demo, we'll just do a simple assertion
            assertThat(homePage.isPageLoaded())
                .as("Homepage should be loaded")
                .isTrue();
        });
    }
}