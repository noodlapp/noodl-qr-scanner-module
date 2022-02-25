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
		this._internal.currentOptions = {returnDetailedScanResult:false};
		this._internal.isRunning = false;
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
				this.createQRScanner (this._internal.currentOptions);
				this.startScanner();
			},
		},
		stop:{
			displayName:'Stop',
			signal:function() {
				this.stopScanner();
			}
		}
	},
	changed:{
		frontFacing:function () {
			this._internal.currentOptions.preferredCamera = this.inputs.frontFacing === true?'user':'environment';
			if (this._internal.isRunning === true) {
				this.createQRScanner (this._internal.currentOptions);
				this.startScanner();
			}
		},

		videoNode:function () {
			
		}	
	},
	methods:{
		createQRScanner : function (options) {
			if (this._internal.qrScanner !== null) {
				// destroy the old qr scanner
				/*if (this._internal.isRunning === true) {
					this.stopScanner ();
				}*/
				console.log ("destroying scanner");
				this._internal.qrScanner.destroy ();
				this._internal.qrScanner = null;
			}
			if (this._internal.qrScanner === null) {
				console.log ("creating qrscanner");
				this._internal.qrScanner = new QrScanner(this.inputs.videoNode, result => {
					console.log (result);
					this.setOutputs ({result:result.data}); 
					this.sendSignalOnOutput ("scannedResult");
				}, options);
			}
		},
		startScanner: function () {
			if (this._internal.qrScanner !== null) {
				this._internal.qrScanner.start ();
				this._internal.isRunning = true;
			}
			
		},
		stopScanner: function () {
			if (this._internal.qrScanner !== null) {
				this._internal.qrScanner.stop ();
			}
			this._internal.isRunning = false;
		}
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