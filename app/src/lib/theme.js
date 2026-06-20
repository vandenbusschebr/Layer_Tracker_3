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

  // Dove White
  doveWhite: '#F5F4F2',
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
  buttonInsetShadow: 'inset 0 2px 3px rgba(255,255,255,0.2), inset 0 1px 2px rgba(0,0,0,0.8)',
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

// ─── Typography ───────────────────────────────────────────────────────────────

export const fonts = {
  heading: "'New Amsterdam', sans-serif",
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
