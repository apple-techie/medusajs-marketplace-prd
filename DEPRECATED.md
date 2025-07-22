# Deprecated Documentation

**Last Updated**: July 22, 2025

This file lists documentation and approaches that have been superseded by the hybrid implementation strategy outlined in [IMPLEMENTATION-STRATEGY.md](IMPLEMENTATION-STRATEGY.md).

## Superseded Approaches

### 1. Standalone Marketplace Module
**Previous Approach**: Simple marketplace module integration  
**Current Approach**: Hybrid strategy with Next.js Starter + Mercur components  
**Reference**: See IMPLEMENTATION-STRATEGY.md

### 2. Building from Scratch
**Previous Consideration**: Creating custom storefront from scratch  
**Current Approach**: Using Next.js Starter as base with customizations  
**Reason**: Saves 3-4 months of development time

### 3. Direct Mercur Usage
**Previous Consideration**: Using Mercur as-is for the marketplace  
**Current Approach**: Adapting Mercur patterns for our specific vendor types  
**Reason**: Our marketplace has more complex requirements (3 vendor types, commission tiers)

## Documentation Hierarchy

For the most current implementation guidance, refer to these documents in order:

1. **[IMPLEMENTATION-STRATEGY.md](IMPLEMENTATION-STRATEGY.md)** - Primary technical roadmap
2. **[01-CORE-ARCHITECTURE/04-FRONTEND-ARCHITECTURE.md](01-CORE-ARCHITECTURE/04-FRONTEND-ARCHITECTURE.md)** - Frontend architecture details
3. **[04-CUSTOMER-EXPERIENCE/03-STOREFRONT-IMPLEMENTATION.md](04-CUSTOMER-EXPERIENCE/03-STOREFRONT-IMPLEMENTATION.md)** - Storefront specifics
4. **[06-UI-UX/03-COMPONENT-ARCHITECTURE.md](06-UI-UX/03-COMPONENT-ARCHITECTURE.md)** - Component patterns

## Legacy Files

The following files may contain outdated information and should be read with caution:

- Any marketplace integration guides that don't reference the hybrid approach
- Generic module READMEs without marketplace-specific content
- Documentation suggesting single-application architecture

## Migration Notice

If you're working from older documentation, please:
1. Review IMPLEMENTATION-STRATEGY.md first
2. Align your work with the monorepo structure
3. Use shared packages for UI components
4. Follow the hybrid approach patterns

Always refer to documents dated July 22, 2025 or later for the most current approach.