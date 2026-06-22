// ─── Primitive Colors ────────────────────────────────────────────────────────

export const colors = {
  // Teal
  teal: {
    10:  '#EAF5F3',
    20:  '#C1DDD9',
    60:  '#8BBDB8',
    100: '#4B8D85',
    120: '#2D6560',
    140: '#153B39',
  },

  // Grey
  grey: {
    0:   '#FFFFFF',
    10:  '#EAEBEB',
    20:  '#D5D8D7',
    40:  '#ABB0AF',
    60:  '#808988',
    80:  '#566160',
    100: '#2C3A38',
    120: '#232E2D',
    140: '#1A2322',
    160: '#121716',
    180: '#000000',
  },

  // Blue
  blue: {
    10:  '#E8EEF8',
    20:  '#BAC9E8',
    60:  '#7899D0',
    100: '#2D5FA8',
    120: '#1A3F77',
    140: '#0A2145',
  },

  // Red
  red: {
    10:  '#F5EBEA',
    20:  '#E1BEBD',
    60:  '#C07978',
    100: '#8C2E2E',
    120: '#621E1E',
    140: '#350C0C',
  },

  // Green
  green: {
    10:  '#ECF0EE',
    20:  '#D8E1DC',
    60:  '#8BA697',
    100: '#3D6B52',
    120: '#254031',
    140: '#0C1510',
  },

  // Orange
  orange: {
    10:  '#FBF1E6',
    20:  '#F1CFA4',
    60:  '#DAA16A',
    100: '#C27A3B',
    120: '#8C5320',
    140: '#4E2D0C',
  },

  // Slate Blue
  slateBlue: {
    10:  '#EBF0F6',
    20:  '#C0D2DF',
    60:  '#85A3B8',
    100: '#506D82',
    120: '#314D61',
    140: '#182E3B',
  },

  // Brown
  brown: {
    10:  '#FCF9F5',
    20:  '#F1E3CF',
    40:  '#DCC4B0',
    60:  '#A28266',
    100: '#642F00',
    120: '#3C1C00',
    140: '#140900',
  },

  // Dove White
  doveWhite: '#F5F4F2',
};

// ─── Size Scale ───────────────────────────────────────────────────────────────

export const size = {
  none: 0,
  xxs:  1,
  xs:   2,
  s:    4,
  m:    8,
  l:    12,
  xl:   16,
  xxl:  24,
  xxxl: 36,
};

// ─── Semantic Aliases ─────────────────────────────────────────────────────────

export const brand = {
  10:  colors.teal[10],
  20:  colors.teal[20],
  60:  colors.teal[60],
  100: colors.teal[100],
  120: colors.teal[120],
  140: colors.teal[140],
};

export const nationalPark = {
  10:  colors.brown[10],
  20:  colors.brown[20],
  40:  colors.brown[40],
  60:  colors.brown[60],
  100: colors.brown[100],
  120: colors.brown[120],
  140: colors.brown[140],
};

export const success = {
  10:  colors.green[10],
  20:  colors.green[20],
  60:  colors.green[60],
  100: colors.green[100],
  120: colors.green[120],
  140: colors.green[140],
};

export const error = {
  10:  colors.red[10],
  20:  colors.red[20],
  60:  colors.red[60],
  100: colors.red[100],
  120: colors.red[120],
  140: colors.red[140],
};

export const warning = {
  10:  colors.orange[10],
  20:  colors.orange[20],
  60:  colors.orange[60],
  100: colors.orange[100],
  120: colors.orange[120],
  140: colors.orange[140],
};

export const info = {
  10:  colors.blue[10],
  20:  colors.blue[20],
  60:  colors.blue[60],
  100: colors.blue[100],
  120: colors.blue[120],
  140: colors.blue[140],
};

// ─── Semantic Colors ──────────────────────────────────────────────────────────

export const semantic = {
  // Brand
  brand:    colors.teal[100],
  brand10:  colors.teal[10],
  brand20:  colors.teal[20],
  brand60:  colors.teal[60],
  brand120: colors.teal[120],
  brand140: colors.teal[140],

  // Text
  primaryText:  colors.doveWhite,
  textLight:    colors.doveWhite,
  disabledText: colors.grey[20],
  brandText:    colors.teal[100],
  labelText:    colors.grey[40],
  mutedText:    colors.grey[80],
  placeholderText: 'rgba(245,244,242,0.5)',

  // Surfaces
  surface:          colors.grey[180],
  overlay:          colors.grey[140],
  drawerBg:         '#0D1716',
  cardGradient:     `linear-gradient(180deg, ${colors.grey[160]} 0%, ${colors.grey[120]} 100%)`,
  inputBg:          'rgba(255,255,255,0.06)',
  inputBorder:      'rgba(255,255,255,0.1)',
  divider:          'rgba(255,255,255,0.1)',
  backdrop:         'rgba(0,0,0,0.6)',
  modalOverlay:     'rgba(0,0,0,0.7)',
  drawerHandle:     'rgba(255,255,255,0.2)',
  imageFallbackBg:  'rgba(255,255,255,0.08)',
  photoUploadBg:    'rgba(255,255,255,0.04)',
  selectedOverlay:  'rgba(45,101,96,0.65)',
  brandActive:      'rgba(75,141,133,0.25)',
  brandSaving:      'rgba(75,141,133,0.5)',
  brandShadow:      '0 4px 16px rgba(75,141,133,0.4)',
  primaryButtonColor:  colors.doveWhite,
  primaryButtonShadow: '0 4px 16px rgba(75,141,133,0.4)',
  buttonInsetShadow: 'inset 0 2px 3px rgba(255,255,255,0.2), inset 0 1px 2px rgba(0,0,0,0.8), inset 4px 4px 0 0 rgba(0,0,0,0.25)',
  toolbarGradient:  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 60%)',

  // Feels
  stoked:       colors.green[100],
  stokedShadow: colors.teal[100],
  chilled:      colors.blue[100],
  chilledShadow: colors.blue[100],
  drippin:      colors.red[100],
  drippinShadow: colors.red[100],

  // Errors
  error:     colors.red[100],
  errorText: colors.red[60],
};

// ─── National Park Theme Semantics ────────────────────────────────────────────

export const semanticNP = {
  // Brand / Action
  brand:           brand[100],
  brand10:         brand[10],
  brand20:         brand[20],
  brand60:         brand[60],
  brand120:        brand[120],
  brand140:        brand[140],

  // Text
  primaryText:     nationalPark[120],
  textDark:        nationalPark[100],
  textLight:       nationalPark[20],
  labelText:       nationalPark[60],
  mutedText:       nationalPark[40],
  placeholderText: `rgba(${parseInt(colors.brown[60].slice(1,3),16)},${parseInt(colors.brown[60].slice(3,5),16)},${parseInt(colors.brown[60].slice(5,7),16)},0.5)`,
  disabledText:    colors.grey[10],
  brandText:       brand[100],

  // Surfaces
  surface:         nationalPark[10],
  element:         nationalPark[20],
  elementDark:     nationalPark[120],
  overlay:         nationalPark[20],
  drawerBg:        nationalPark[10],
  cardGradient:    `linear-gradient(180deg, ${colors.brown[20]} 0%, ${colors.brown[40]} 100%)`,
  inputBg:         nationalPark[20],
  inputBorder:     nationalPark[40],
  divider:         nationalPark[40],
  backdrop:        'rgba(20,9,0,0.5)',
  modalOverlay:    'rgba(20,9,0,0.7)',
  drawerHandle:    nationalPark[40],
  imageFallbackBg: nationalPark[20],
  photoUploadBg:   nationalPark[10],
  selectedOverlay: 'rgba(61,107,82,0.55)',
  brandActive:     `rgba(75,141,133,0.2)`,
  brandSaving:     `rgba(75,141,133,0.4)`,
  brandShadow:     '0 4px 16px rgba(75,141,133,0.35)',
  primaryButtonColor:  nationalPark[20],
  primaryButtonShadow: 'inset 4px 4px 0 0 rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.25)',
  buttonInsetShadow: 'inset 0 2px 3px rgba(255,255,255,0.3), inset 0 1px 2px rgba(0,0,0,0.2), inset 4px 4px 0 0 rgba(0,0,0,0.25)',
  toolbarGradient: `linear-gradient(to bottom, transparent 0%, ${colors.brown[20]}CC 60%)`,

  // Status backgrounds
  successBg:       success[20],
  warningBg:       warning[20],
  infoBg:          colors.blue[20],
  errorBg:         error[20],

  // Activity title feels
  stokedTitle:     success[100],
  chilledTitle:    colors.blue[100],
  sweatyTitle:     colors.red[100],

  // Feels
  stoked:          colors.green[100],
  stokedShadow:    brand[100],
  chilled:         colors.blue[100],
  chilledShadow:   colors.blue[100],
  drippin:         colors.red[100],
  drippinShadow:   colors.red[100],

  // Errors
  error:           error[100],
  errorText:       error[60],
};

// ─── Typography ───────────────────────────────────────────────────────────────

export const fonts = {
  heading: "'New Amsterdam', sans-serif",
  mono:    "'Montserrat', sans-serif",
};

export const fontsNP = {
  heading: "'Chela One', sans-serif",
  mono:    "'Montserrat', sans-serif",
};

export const monoStyle = {
  fontFamily: fonts.mono,
  fontWeight: 800,
};

// ─── Reusable Style Objects ───────────────────────────────────────────────────

export const labelStyle = {
  ...monoStyle,
  color:         semantic.labelText,
  fontSize:      '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

export const headingStyle = {
  fontFamily:    fonts.heading,
  letterSpacing: '0.06em',
};

export const inputStyle = {
  ...monoStyle,
  backgroundColor: semantic.inputBg,
  border:          `1px solid ${semantic.inputBorder}`,
  borderRadius:    '8px',
  color:           semantic.primaryText,
  fontSize:        '14px',
  padding:         '10px 12px',
  width:           '100%',
  outline:         'none',
};

// ─── Feel Config ──────────────────────────────────────────────────────────────

export const feelConfig = {
  Stoked: {
    color:        semantic.stoked,
    shadow:       semantic.stokedShadow,
    label:        '🤙 Stoked',
    activeColor:  'rgba(61,107,82,0.4)',
    activeBorder: colors.green[100],
    glow:         colors.teal[100],
  },
  Chilled: {
    color:        semantic.chilled,
    shadow:       semantic.chilledShadow,
    label:        '🥶 Chilled',
    activeColor:  'rgba(45,95,168,0.4)',
    activeBorder: colors.blue[100],
    glow:         colors.blue[100],
  },
  Drippin: {
    color:        semantic.drippin,
    shadow:       semantic.drippinShadow,
    label:        '🥵 Drippin',
    activeColor:  'rgba(140,46,46,0.4)',
    activeBorder: colors.red[100],
    glow:         colors.red[100],
  },
};
