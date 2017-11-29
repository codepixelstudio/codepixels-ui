'use babel';

export default function toggleClassName( className, mustAddClass ) {

    const panesizer = document.documentElement;
    const viewport = panesizer.offsetWidth;

    // panesizer.classList.add( 'codepixelstudio', 'standard' );
    panesizer.classList.add( 'codepixelstudio' );

    if ( mustAddClass && viewport == 2560 ) {
    // if ( mustAddClass ) {

        // panesizer.classList.add( className );
        // panesizer.classList.remove( 'standard' );

    } else {

        // panesizer.classList.remove( className );
        // panesizer.classList.add( 'standard' );

    }

}
