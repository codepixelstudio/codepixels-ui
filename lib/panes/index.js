'use babel';

import toggleClassName from '../helper/toggle-class-name';

atom.config.observe( 'code-pixel-studio-ui.panes.widescreenUI', ( value ) => {

    toggleClassName( 'widescreen', value );

});
