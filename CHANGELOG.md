# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.5] - 2021-02-16

### Added

- Added RO messages

## [0.2.4] - 2021-01-08

### Fixed

- Check if `postalCode` has asterix(`*`) instead of `isNaN`

## [0.2.3] - 2020-10-07

### Fixed

- Error when shopper has `null` address in their orderForm
- Intl message ID mismatch

### Added

- CODEOWNERS file

## [0.2.2] - 2020-10-06

### Changed

- Add ES & PT messages

## [0.2.1] - 2020-10-05

### Changed

- Update docs

## [0.2.0] - 2020-10-01

### Added

- New PDP components: `LocationQuery`, `AvailabilityHeader`, `PickupAvailability`, `ShippingAvailability`

## [0.1.3] - 2020-09-22

### Fixed

- Prevent the app from loading if the address is `null`

## [0.1.2] - 2020-09-21

### Fixed

- EDT with "in days" for pickup with more than 1 day

## [0.1.1] - 2020-09-15

### Added

- Group similar shipping options not allowing to show more than 1 of the same kind

## [0.1.0] - 2020-09-02

### Added

- `orderBy` and `pickupFirst` properties

### Updated

- Doc

## [0.0.1] - 2020-09-02

### Added

- Intial release.
- Docs
- Translation
- Sync with `shopper-location`
