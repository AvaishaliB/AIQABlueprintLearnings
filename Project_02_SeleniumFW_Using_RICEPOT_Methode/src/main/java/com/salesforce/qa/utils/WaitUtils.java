package com.salesforce.qa.utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public final class WaitUtils {

    private final WebDriverWait wait;

    public WaitUtils(WebDriver driver) {
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(ConfigReader.getExplicitWait()));
    }

    public WaitUtils(WebDriver driver, int timeoutInSeconds) {
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
    }

    public WebElement waitForVisibility(WebElement element) {
        try {
            return wait.until(ExpectedConditions.visibilityOf(element));
        } catch (Exception e) {
            throw new RuntimeException("Element not visible within timeout: " + e.getMessage(), e);
        }
    }

    public WebElement waitForClickable(WebElement element) {
        try {
            return wait.until(ExpectedConditions.elementToBeClickable(element));
        } catch (Exception e) {
            throw new RuntimeException("Element not clickable within timeout: " + e.getMessage(), e);
        }
    }

    public void waitForUrlChange(String partialUrl) {
        try {
            wait.until(ExpectedConditions.urlContains(partialUrl));
        } catch (Exception e) {
            throw new RuntimeException("URL did not contain '" + partialUrl + "' within timeout: " + e.getMessage(), e);
        }
    }

    public void waitForTitleContains(String partialTitle) {
        try {
            wait.until(ExpectedConditions.titleContains(partialTitle));
        } catch (Exception e) {
            throw new RuntimeException("Title did not contain '" + partialTitle + "' within timeout: " + e.getMessage(), e);
        }
    }
}
