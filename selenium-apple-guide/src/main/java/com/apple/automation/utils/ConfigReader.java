package com.apple.automation.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Singleton configuration reader for properties files.
 */
public class ConfigReader {
    
    private static final Logger logger = LogManager.getLogger(ConfigReader.class);
    private static ConfigReader instance;
    private final Properties properties;
    private static final String DEFAULT_CONFIG_FILE = "config.properties";
    
    private ConfigReader() {
        properties = new Properties();
        loadProperties();
    }
    
    /**
     * Gets the singleton instance.
     */
    public static synchronized ConfigReader getInstance() {
        if (instance == null) {
            instance = new ConfigReader();
        }
        return instance;
    }
    
    /**
     * Loads properties from configuration file.
     */
    private void loadProperties() {
        String configFile = System.getProperty("config.file", DEFAULT_CONFIG_FILE);
        
        try {
            // Try to load from classpath first
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream(configFile);
            
            if (inputStream == null) {
                // Try to load from file system
                inputStream = new FileInputStream("src/test/resources/" + configFile);
            }
            
            properties.load(inputStream);
            logger.info("Configuration loaded from: {}", configFile);
            
        } catch (IOException e) {
            logger.error("Failed to load configuration file: {}", configFile, e);
            // Load default properties
            loadDefaultProperties();
        }
    }
    
    /**
     * Loads default properties if config file is not found.
     */
    private void loadDefaultProperties() {
        properties.setProperty("base.url", "https://www.apple.com");
        properties.setProperty("implicit.wait", "10");
        properties.setProperty("explicit.wait", "10");
        properties.setProperty("page.load.timeout", "30");
        properties.setProperty("screenshot.path", "target/screenshots");
        properties.setProperty("retry.count", "2");
        logger.info("Loaded default configuration properties");
    }
    
    /**
     * Gets property value by key.
     */
    public String getProperty(String key) {
        String value = properties.getProperty(key);
        if (value == null) {
            logger.warn("Property '{}' not found", key);
        }
        return value;
    }
    
    /**
     * Gets property value with default.
     */
    public String getProperty(String key, String defaultValue) {
        return properties.getProperty(key, defaultValue);
    }
    
    /**
     * Gets integer property value.
     */
    public int getIntProperty(String key, int defaultValue) {
        String value = properties.getProperty(key);
        if (value != null) {
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException e) {
                logger.error("Invalid integer value for property '{}': {}", key, value);
            }
        }
        return defaultValue;
    }
    
    /**
     * Gets boolean property value.
     */
    public boolean getBooleanProperty(String key, boolean defaultValue) {
        String value = properties.getProperty(key);
        if (value != null) {
            return Boolean.parseBoolean(value);
        }
        return defaultValue;
    }
    
    /**
     * Gets all properties.
     */
    public Properties getAllProperties() {
        return new Properties(properties);
    }
}