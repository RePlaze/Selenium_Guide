package com.apple.automation.pages;

import com.apple.automation.core.BasePage;
import io.qameta.allure.Step;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

/**
 * Page Object for Apple Shopping Bag page.
 */
public class AppleBagPage extends BasePage {
    
    // Locators
    private static final By BAG_CONTAINER = By.cssSelector(".rs-bag");
    private static final By EMPTY_BAG_MESSAGE = By.cssSelector(".rs-bag-empty");
    private static final By BAG_ITEMS = By.cssSelector(".rs-bag-item");
    private static final By CHECKOUT_BUTTON = By.cssSelector("button[data-autom='checkout']");
    private static final By SUBTOTAL = By.cssSelector(".rs-summary-subtotal");
    
    @FindBy(css = ".rs-bag-item-name")
    private List<WebElement> itemNames;
    
    @FindBy(css = ".rs-bag-item-price")
    private List<WebElement> itemPrices;
    
    @FindBy(css = ".rs-bag-item-remove")
    private List<WebElement> removeButtons;
    
    public AppleBagPage(WebDriver driver) {
        super(driver);
    }
    
    @Override
    public boolean isPageLoaded() {
        return isElementVisible(BAG_CONTAINER);
    }
    
    /**
     * Checks if bag is empty.
     */
    @Step("Check if bag is empty")
    public boolean isBagEmpty() {
        return isElementVisible(EMPTY_BAG_MESSAGE);
    }
    
    /**
     * Gets the empty bag message.
     */
    public String getEmptyBagMessage() {
        if (!isBagEmpty()) {
            return "";
        }
        return getText(EMPTY_BAG_MESSAGE);
    }
    
    /**
     * Gets the number of items in bag.
     */
    @Step("Get items count in bag")
    public int getItemsCount() {
        if (isBagEmpty()) {
            return 0;
        }
        return driver.findElements(BAG_ITEMS).size();
    }
    
    /**
     * Gets all item names in bag.
     */
    public List<String> getItemNames() {
        return itemNames.stream()
            .map(WebElement::getText)
            .map(String::trim)
            .toList();
    }
    
    /**
     * Removes item by index.
     */
    @Step("Remove item at position: {index}")
    public void removeItem(int index) {
        if (index < 0 || index >= removeButtons.size()) {
            throw new IllegalArgumentException("Invalid item index: " + index);
        }
        
        WebElement removeButton = removeButtons.get(index);
        scrollToElement(removeButton);
        removeButton.click();
        
        // Wait for bag to update
        waitForAjax();
        logger.info("Removed item at position {}", index + 1);
    }
    
    /**
     * Removes item by name.
     */
    @Step("Remove item: {itemName}")
    public void removeItemByName(String itemName) {
        for (int i = 0; i < itemNames.size(); i++) {
            if (itemNames.get(i).getText().contains(itemName)) {
                removeItem(i);
                return;
            }
        }
        throw new IllegalArgumentException("Item not found in bag: " + itemName);
    }
    
    /**
     * Gets the subtotal amount.
     */
    public String getSubtotal() {
        if (isBagEmpty()) {
            return "$0.00";
        }
        return getText(SUBTOTAL);
    }
    
    /**
     * Proceeds to checkout.
     */
    @Step("Proceed to checkout")
    public void proceedToCheckout() {
        if (isBagEmpty()) {
            throw new IllegalStateException("Cannot checkout with empty bag");
        }
        
        WebElement checkoutButton = waitForElement(CHECKOUT_BUTTON);
        scrollToElement(checkoutButton);
        checkoutButton.click();
        logger.info("Proceeding to checkout");
    }
    
    /**
     * Continues shopping.
     */
    @Step("Continue shopping")
    public AppleHomePage continueShopping() {
        // Click on Apple logo or use browser back
        driver.findElement(By.cssSelector("a.ac-gn-link-apple")).click();
        return new AppleHomePage(driver);
    }
    
    /**
     * Updates quantity for an item.
     */
    @Step("Update quantity for item {index} to {quantity}")
    public void updateItemQuantity(int index, int quantity) {
        By quantitySelector = By.cssSelector(
            String.format(".rs-bag-item:nth-child(%d) select", index + 1));
        
        WebElement quantityDropdown = waitForElement(quantitySelector);
        scrollToElement(quantityDropdown);
        
        // Select new quantity
        quantityDropdown.click();
        quantityDropdown.findElement(
            By.cssSelector(String.format("option[value='%d']", quantity))).click();
        
        // Wait for bag to update
        waitForAjax();
        logger.info("Updated quantity for item {} to {}", index + 1, quantity);
    }
}