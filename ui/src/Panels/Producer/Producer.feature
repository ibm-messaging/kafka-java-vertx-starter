Feature: Starter app Producer

Scenario: As a user, I can start and stop production as I choose
    Given I have a Producer panel
    When I start the producer
    Then the producer is running
    When I stop the producer
    Then the producer is not running

Scenario: As a user, I can provide the message value for produced messages
    Given I have a Producer panel
    And I set the message value to "A new value"
    When I start the producer
    Then the producer has been started with "A new value" as the message value
    And the message value input is disabled

Scenario: As a user, I can see statistics of what has been produced so far
    Given I have a Producer panel
    When I start the producer
    And responses are returned
    Then it should display statistics about what has been produced

Scenario: As a user, I am shown error states if production fails
    Given I have a Producer panel
    When I start the producer
    And Error responses are returned
    Then I should be shown error messages for those production failures

Scenario: As a user, I can interact and be shown the currently selected message
    Given I have a Producer panel
    And I have produced "5" messages already
    When I interact with produced message "2"
    Then produced message "2" is shown as selected

Scenario: As a user, I can see what has been produced so far
    Given I have a Producer panel
    And I have produced "5" messages already
    When I start the producer
    And responses are returned
    Then I should be able to see the last "5" messages that have been produced
