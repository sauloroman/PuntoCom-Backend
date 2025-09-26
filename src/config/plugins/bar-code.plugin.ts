import bwipjs from "bwip-js";

export class BarCodeAdapter {

    public static generate( code: string ) {
        return bwipjs.toBuffer({
            bcid: 'code128',
            text: code,
            scale: 3,
            height: 10,
            includetext: true,
            textxalign: 'center'
        })
    }

}