# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
- 

## [0.0.1] - 2018-02-09
### Added
- Personal Finance management module
- Add finance routes INDEX, NEW, CREATE, SHOW, EDIT, UPDATE, DESTROY
- UPDATE in 3 stages to manage payment history array: 
  Stage 1: update previous paid amounts
  Stage 2: add new amount to recurring payment
  Stage 3: update remaining information
- This changelog, to better track project changes. 

### Changed
- Logo images
- Navbar logo uses Google Fonts and is no longer an image
- Fix input type="date" browser support with jQweryUI

### Removed
- None