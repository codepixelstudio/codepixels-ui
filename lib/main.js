'use babel';

import toggleClassName from './helper/toggle-class-name';
import './panes';

const classNames = {

    // panes
    'widescreen' : atom.config.get( 'code-pixel-studio-ui.panes.widescreenUI' ),

};

export default {

    activate() {

        Object.keys( classNames ).forEach( className => (

            toggleClassName( className, classNames[className] ) ),

        );

    },

    deactivate() {

        // reset your shit code
        Object.keys( classNames ).forEach( className =>

            toggleClassName( className, false )

        );

    },

};
