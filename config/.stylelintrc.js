module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // ═══════════════════════════════════════════════════════════════
    // PHASE 1: COLOR TOKENS ONLY (Spacing/typography relaxed)
    // Tighten in Phase 2 after team is comfortable
    // ═══════════════════════════════════════════════════════════════
    
    // Block hex colors - ENFORCED (brand consistency)
    'color-no-hex': true,
    
    // Block named colors (except transparent, inherit, currentColor)
    'color-named': 'never',
    
    // Require CSS variables for COLORS ONLY
    'declaration-property-value-allowed-list': {
      // Colors must use tokens - ENFORCED
      'color': ['/^var\\(--color-/', 'inherit', 'currentColor', 'transparent'],
      'background-color': ['/^var\\(--color-/', 'inherit', 'transparent', 'none'],
      'border-color': ['/^var\\(--color-/', 'inherit', 'currentColor', 'transparent'],
      'outline-color': ['/^var\\(--color-/', 'inherit', 'currentColor'],
      'fill': ['/^var\\(--color-/', 'inherit', 'currentColor', 'none'],
      'stroke': ['/^var\\(--color-/', 'inherit', 'currentColor', 'none'],
      
      // NOTE: Spacing, typography, shadows, z-index - RELAXED for Phase 1
      // Uncomment these in Phase 2 (after Q1):
      // 'padding': ['/^var\\(--spacing-/', '0', '/^0\\s/'],
      // 'margin': ['/^var\\(--spacing-/', '0', 'auto'],
      // 'font-size': ['/^var\\(--font-size-/', 'inherit'],
    },
    
    // ═══════════════════════════════════════════════════════════════
    // BEM NAMING - WARNING ONLY (not blocking)
    // ═══════════════════════════════════════════════════════════════
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      {
        message: 'Suggestion: Use BEM naming (.block__element--modifier)',
        severity: 'warning',
      },
    ],
    
    // ═══════════════════════════════════════════════════════════════
    // CSS MODULES
    // ═══════════════════════════════════════════════════════════════
    
    // Allow :global() for CSS Modules
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'local'] },
    ],
    
    // ═══════════════════════════════════════════════════════════════
    // GENERAL QUALITY
    // ═══════════════════════════════════════════════════════════════
    
    // No !important (except in utilities)
    'declaration-no-important': true,
    
    // Consistent formatting
    'declaration-block-single-line-max-declarations': 1,
    
    // No vendor prefixes (use autoprefixer)
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    
    // No duplicate properties
    'declaration-block-no-duplicate-properties': true,
    
    // Empty line before comments
    'comment-empty-line-before': 'always',
  },
  
  overrides: [
    {
      // Global CSS can have more flexibility
      files: ['**/globals.css', '**/reset.css', '**/design-tokens.css'],
      rules: {
        'color-no-hex': null,
        'declaration-property-value-allowed-list': null,
        'selector-class-pattern': null,
      },
    },
  ],
};
