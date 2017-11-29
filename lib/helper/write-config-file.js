'use babel';

import fs from 'fs';

function writeConfigFile( content, reload = false ) {

    return new Promise( ( resolve, reject ) => {

        if ( !content ) return reject({

            success : false,
            error   : 'No content given'

        });

        fs.writeFile( `${__dirname}/../../styles/user-settings.less`, content, 'utf8', ( error ) => {

            if ( error ) return reject({

                success : false,
                error   : 'Failed to write settings file'

            });

            if ( reload ) {

                const codepixelstudio = atom.packages.getLoadedPackage( 'code-pixel-studio-ui' );

                if ( codepixelstudio ) {

                    codepixelstudio.deactivate();

                    setImmediate(() => codepixelstudio.activate());

                }

            }

            return resolve({

                success : true,
                error   : null

            });

        });

        return resolve({

            success : true,
            error : null

        });

    });

}

export default writeConfigFile;
