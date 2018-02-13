# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.0.8] - 2018-02-13
### Changed
- Refactoring
- Schema changes

## [0.0.7] - 2018-02-12
### Changed
- Code cleanup: models to separate files
- Finance to separate folder

## [0.0.6] - 2018-02-10
### Added
- Add sums in finance view
- Add savings section
- Can now add new recurring payment when editing payment 

### Changed
- Finance INDEX page only shows current month by default
- Show category and date in payment listing
- Differentiate between confirmed transactions and pending transactions
- Link to EDIT page instead of SHOW page
- Add Delete button to EDIT page
- Styling fixes

## [0.0.5] - 2018-02-09
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