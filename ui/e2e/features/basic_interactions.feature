Feature: Basic Interactions

Background:
    Given I am on the homepage

Scenario: I can start producing
    When I start the producer
    Then a message appears in the producer list

# Scenario: I can pause and restart producing
#     When I start the producer
#     And a message appears in the producer list
#     And I stop the producer
#     And I start the producer
#     Then a message appears in the producer list

# Scenario: I can produce a message with a custom message
#     When I set the payload to "test"
#     And I start the producer
#     Then a message appears in the producer list with payload "test"

# Scenario: I can start consuming
#     When I start the producer
#     And I start the consumer
#     Then a message appears in the consumer list

# Scenario: I can pause and restart consuming
#     When I start the producer
#     And I start the consumer
#     And a message appears in the consumer list
#     And I stop the consumer
#     And I start the consumer
#     Then a message appears in the consumer list

# Scenario: Hovering over a produced message highlights the consumed equivalent
#     When I start the producer
#     And I start the consumer
#     When a message appears in the producer list
#     And I stop the producer
#     And the message has been consumed
#     And I hover over the last produced message
#     Then the consumed message is highlighted

# Scenario: Hovering over a consumed message highlights the produced equivalent
#     When I start the producer
#     And I start the consumer
#     When a message appears in the producer list
#     And I stop the producer
#     And the message has been consumed
#     And I hover over the consumed message
#     Then the produced message is highlighted
