#!/bin/bash

# Apple-Style Selenium Test Runner
# Clean, minimal, powerful

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default values
BROWSER="chrome"
GROUPS="smoke"
HEADLESS="false"
PARALLEL="false"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--browser)
            BROWSER="$2"
            shift 2
            ;;
        -g|--groups)
            GROUPS="$2"
            shift 2
            ;;
        -h|--headless)
            HEADLESS="true"
            shift
            ;;
        -p|--parallel)
            PARALLEL="true"
            shift
            ;;
        --help)
            echo "Apple Selenium Test Runner"
            echo ""
            echo "Usage: ./run-tests.sh [options]"
            echo ""
            echo "Options:"
            echo "  -b, --browser    Browser to use (chrome, firefox, safari) [default: chrome]"
            echo "  -g, --groups     Test groups to run (smoke, regression, all) [default: smoke]"
            echo "  -h, --headless   Run in headless mode"
            echo "  -p, --parallel   Run tests in parallel"
            echo "  --help          Show this help message"
            echo ""
            echo "Examples:"
            echo "  ./run-tests.sh                              # Run smoke tests in Chrome"
            echo "  ./run-tests.sh -b firefox -g regression     # Run regression tests in Firefox"
            echo "  ./run-tests.sh -h -p                        # Run headless and parallel"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Print test configuration
echo ""
echo "🍎 Apple Selenium Test Runner"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_info "Browser: $BROWSER"
print_info "Groups: $GROUPS"
print_info "Headless: $HEADLESS"
print_info "Parallel: $PARALLEL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Build Maven command
MVN_CMD="mvn clean test"
MVN_CMD="$MVN_CMD -Dbrowser=$BROWSER"
MVN_CMD="$MVN_CMD -Dheadless=$HEADLESS"

if [[ "$GROUPS" != "all" ]]; then
    MVN_CMD="$MVN_CMD -Dgroups=$GROUPS"
fi

if [[ "$PARALLEL" == "true" ]]; then
    MVN_CMD="$MVN_CMD -Dparallel=methods -DthreadCount=3"
fi

# Run tests
print_info "Executing: $MVN_CMD"
echo ""

$MVN_CMD

# Check test result
if [ $? -eq 0 ]; then
    echo ""
    print_success "Tests completed successfully!"
    
    # Offer to generate Allure report
    echo ""
    read -p "Generate Allure report? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Generating Allure report..."
        mvn allure:serve
    fi
else
    echo ""
    print_error "Tests failed!"
    exit 1
fi