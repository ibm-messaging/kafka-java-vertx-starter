# App

This component acts as the container/composer of the application. It will render introductory text, and optionally a producer & consumer panel.

## Properties

- `className` - optional - add any specific styling classes to this component.
This will be appended to the root of the component.
- `producer` - optional - boolean - enable producer
- `consumer` - optional - boolean - enable consumer

## Testing

As this component can be considered a full integration piece, it should be tested like a `Panel` via behavioural tests to confirm expected rendering. However, the e2e tests will cover the full integration to avoid duplicating behaviour and mocking.

## Usage

The full set of exposed components are as follows:
 - `App`