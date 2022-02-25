const Noodl = require('@noodl/noodl-sdk');
//import QrScanner from 'qr-scanner';
const QrScanner = require('qr-scanner').default;
console.log (require('qr-scanner'));
console.log (QrScanner);
const QRScannerNode = Noodl.defineNode({
	category:'Camera',
	name:'QR Scanner',
	initialize:function () {
		this._internal.qrScanner = null;
	},
	inputs:{
		 frontFacing: {
			type: 'boolean',
			displayName:'Front Facing',
            default: true
        },
        videoNode: {
        	displayName:'Video node',
        	type: '*'
        }
	},
	outputs:{
		/*stream: {
            type: 'mediastream',
            displayName: 'Media Stream'
        },*/
        result:{
        	type:'string',
        	displayName: 'Scan Result'
        },
        scannedResult: {
        	type:'signal',
        	displayName: 'Scan Ready'
        }/*
        streamStarted: {
            displayName: 'Media Stream Started',
            type: 'signal'
        },
        streamStopped: {
            displayName: 'Media Stream Stopped',
            type: 'signal'
        }*/
	},
	signals:{
		start:{
			displayName:'Start',	
			signal:function() {
				if (this._internal.qrScanner === null) {
					this._internal.qrScanner = new QrScanner(this.inputs.videoNode, result => {
						console.log('decoded qr code:', result);
						this.setOutputs ({result:result}); 
						this.sendSignalOnOutput ("scannedResult");
					});
				}
				this._internal.qrScanner.start ();
			},
		},
		stop:{
			displayName:'Stop',
			signal:function() {
				if (this._internal.qrScanner !== null) {
					this._internal.qrScanner.stop ();
				}
			}
		}
	},
	changed:{
		videoNode:function () {
			
		},
		FirstName:function() {
			this.setOutputs({FullName:this.inputs.FirstName + ' ' + this.inputs.LastName});
		},
		LastName:function() {
			this.setOutputs({FullName:this.inputs.FirstName + ' ' + this.inputs.LastName});
		},		
	}
})

Noodl.defineModule({
    nodes:[
		QRScannerNode
    ],
    setup() {
    	//this is called once on startup
    }
});