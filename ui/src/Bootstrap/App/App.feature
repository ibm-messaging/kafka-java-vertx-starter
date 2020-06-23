Feature: App bootstrapping

Scenario: Displays producer panel
    Given the following properties
        | Name | Value |
        | producer | true |
    And I have an instance of App
    Then the page contains "Example Producer"

Scenario: Hides consumer panel
    Given the following properties
        | Name | Value |
        | producer | false |
    And I have an instance of App
    Then the page does not contain "Example Producer"

Scenario: Displays consumer panel
    Given the following properties
        | Name | Value |
        | consumer | true |
    And I have an instance of App
    Then the page contains "Example Consumer"

Scenario: Hides consumer panel
    Given the following properties
        | Name | Value |
        | consumer | false |
    And I have an instance of App
    Then the page does not contain "Example Consumer"

Scenario: Displays preamble
    Given I have an instance of App
    Then the page contains the image "sample app logo" 
    And the page contains "sample app subheading"
    And the page contains "sample app heading"
    And the page contains "sample app body"

Scenario: Produces messages
    Given the following properties
        | Name | Value |
        | producer | true |
    And I have an instance of App
    When I click to produce a message
    Then a message is produced
