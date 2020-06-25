Feature: App bootstrapping

Scenario: Displays producer panel
    Given the following properties
        | Name | Value |
        | producer | true |
        | websocketFactory | MOCK_SOCKET_FACTORY |
    And I have an instance of App
    Then the page contains "Producer here for topic at /testProducerPath"

Scenario: Hides producer panel
    Given the following properties
        | Name | Value |
        | producer | false |
        | websocketFactory | MOCK_SOCKET_FACTORY |
    And I have an instance of App
    Then the page does not contain "Producer here for topic at /testProducerPath"

Scenario: Displays consumer panel
    Given the following properties
        | Name | Value |
        | consumer | true |
        | websocketFactory | MOCK_SOCKET_FACTORY |
    And I have an instance of App
    Then the page contains "Messages consumed"

Scenario: Hides consumer panel
    Given the following properties
        | Name | Value |
        | consumer | false |
        | websocketFactory | MOCK_SOCKET_FACTORY |
    And I have an instance of App
    Then the page does not contain "Messages consumed"

Scenario: Displays preamble
    Given I have an instance of App
    Then the page contains the image "IBM Event Streams logo" 
    And the page contains "IBM Event Streams"
    And the page contains "Starter Application"
    And the page contains "We've created this starter application in order to give you a starting point to produce and consume messages to IBM Event Streams. Start the producer and see the consumed messages appear."