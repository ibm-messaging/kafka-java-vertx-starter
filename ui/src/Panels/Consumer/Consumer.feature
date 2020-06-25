Feature: Starter app Consumer

Scenario: As a user, I can start and stop consumption as I choose
    Given I have a Consumer panel
    When I start the consumer
    Then the consumer is running
    When I stop the consumer
    Then the consumer is not running

Scenario: As a user, I can see statistics of what has been consumed so far
    Given I have a Consumer panel
    When I start the consumer
    And responses are returned
    Then it should display statistics about what has been consumed

Scenario: As a user, I am shown error states if consumption fails
    Given I have a Consumer panel
    When I start the consumer
    And Error responses are returned
    Then I should be shown error messages for those consumption failures

Scenario: As a user, I can interact and be shown the currenly selected message
    Given I have a Consumer panel
    And I have received "5" messages already
    When I click on consumed message "2"
    Then consumed message "2" is shown as selected
    When I hover on consumed message "3"
    Then consumed message "3" is shown as selected

Scenario: As a user, I can see what has been consumed so far
    Given I have a Consumer panel 
    And I have received "30" messages already
    When I start the consumer
    And responses are returned
    Then I should be able to see the last "30" messages that have been consumed


