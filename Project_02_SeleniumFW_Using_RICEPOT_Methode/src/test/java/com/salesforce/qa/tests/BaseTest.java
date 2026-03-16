package com.salesforce.qa.tests;

import com.salesforce.qa.utils.ConfigReader;
import com.salesforce.qa.utils.DriverFactory;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class BaseTest {

    protected WebDriver driver;

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        try {
            DriverFactory.initDriver();
            driver = DriverFactory.getDriver();
            driver.get(ConfigReader.getBaseUrl());
        } catch (Exception e) {
            throw new RuntimeException("Test setup failed: " + e.getMessage(), e);
        }
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        try {
            DriverFactory.quitDriver();
        } catch (Exception e) {
            throw new RuntimeException("Test teardown failed: " + e.getMessage(), e);
        }
    }
}
