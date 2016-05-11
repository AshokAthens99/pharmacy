define({
  REFILL_RX_VALIDATION:{
    MRN     : {mrn:{min:7,max:8,format:/^[0-9]+$/},rx:{min:4,max:12,format:/^[0-9]+$/}},
    SCA     : {mrn:{min:7,max:10,format:/^[0-9]+$/},rx:{min:7,max:12,format:/^[0-9]+$/}},
    MAS     : {mrn:{min:7,max:9,format:/^[0-9]+$/},rx:{min:8,max:10,format:/^[0-9]+$/}},
    COL     : {mrn:{min:7,max:9,format:/^[0-9]+$/},rx:{min:7,max:12,format:/^[0-9]+$/}},
    KNW     : {mrn:{min:8,max:8,format:/^[0-9]+$/},rx:{min:7,max:12,format:/^[0-9]+$/}},
    HAW     : {mrn:{min:2,max:7,format:/^[0-9]+$/},rx:{min:7,max:12,format:/^[0-9]+$/}},
    GGA     : {mrn:{min:7,max:9,format:/^[0-9]+$/},rx:{min:7,max:12,format:/^[0-9]+$/}},
    MID     : {mrn:{min:7,max:9,format:/^[0-9]+$/},rx:{min:7,max:12,format:/^[0-9]+$/}},
    OTHER   : {mrn:{min:1,max:10,format:/^[0-9]+$/},rx:{min:1,max:12,format:/^[0-9]+$/}}
  },
  SPCL_INSTRN_VALIDATION:{
    MRN     : {max:250,allowed:true},
    SCA     : {max:250,allowed:true},
    MAS     : {max:250,allowed:true},
    COL     : {max:250,allowed:true},
    KNW     : {max:250,allowed:true},
    HAW     : {max:250,allowed:true},
    GGA     : {max:250,allowed:true},
    MID     : {max:250,allowed:true},
    OTHER   : {max:250,allowed:true}
  },
  PLACE_ORDER_ERROR_CODE :[900,950],
  SHOW_MORE_PAGE_SIZE : 10,
  SHOW_MORE_LOCATION_SIZE : 5,
  REGION_ZIPCODE:{
    SCA     : '92656',
    NCA     : '94588',
    KNW     : '97306',
    HAW     : '96749',
    MID     : '20176',
    GGA     : '30263'
   },

  RXs_AUTHORIZATION_CODES: ["002", "003"],
  ALLOW_RXs_TO_SHIP_BY_REGION : {
    MRN     : "true",
    SCA     : "true",
    MAS     : "true",
    COL     : "true",
    KNW     : "true",
    HAW     : "false",
    GGA     : "true"
  },
    CART_SIZE_REGION : {
        HAW     : 5,
        MRN     : 10,
        OHI     : 15,
        OTHER   : 30,
        KNW     : 30,
        SCA     : 30
    },
  REGION_CODE:{
    HAW     : '5100',
    SCA     : '0000',
    MRN     : '1100', // #Prabhakar! this region used for testing purpose, delete before moving to test server.
  },
  RX_TRANSFER_FORM:{
      RULES: {
          ENABLED: {
                  MRN  : true,
                  SCA :  false,
                  MAS  : false,
                  COL  : false,
                  KNW  : true,
                  OHI  : false,
                  HAW  : true,
                  GGA  : true,
                  MID  : false

          }
      }
    },


  COST_ESTIMATE: {
        RULES: {
            ENABLED: {
                    MRN  : {
                             US_MAIL: { allowed:true, isPilot:false},
                             PICKUP: {allow:false, isPilot:false}
                           },
                    SCA :  {
                             US_MAIL: { allowed:true, isPilot:false},
                             PICKUP: {allow:false, isPilot:false}
                           },
                    MAS  : {
                             US_MAIL: { allowed:false, isPilot:false},
                             PICKUP: {allow:false, isPilot:false}
                           },
                    COL  : {
                              US_MAIL: { allowed:false, isPilot:false},
                              PICKUP: {allow:false, isPilot:false}
                           },
                    KNW  : {
                              US_MAIL: { allowed:true, isPilot:false},
                              PICKUP: {allow:false, isPilot:false}
                           },
                    OHI  : {
                              US_MAIL: { allowed:false, isPilot:false},
                              PICKUP: {allow:false, isPilot:false}
                           },
                    HAW  : {
                              US_MAIL: { allowed:false, isPilot:false},
                              PICKUP: {allow:false, isPilot:false}
                           },
                    GGA  : {
                              US_MAIL: { allowed:false, isPilot:false},
                              PICKUP: {allow:false, isPilot:false}
                           }
            },
            PILOT_ENTITLEMENT: "RX_SHPMT_NTFCN_2014_R1"
          }
    },

NOTIFICATION:{
    RULES: {
        ENABLED: {
                MRN  : { PICKUP: { allowed:false, isPilot:false},
                         US_MAIL: { allowed:false, isPilot:false}
                       },
                SCA :  { PICKUP: { allowed:false, isPilot:false},
                         US_MAIL: { allowed:false, isPilot:false}
                       },
                MAS  : { PICKUP: {allowed:false, isPilot:false},
                         US_MAIL: { allowed:false, isPilot:false}
                       },
                COL  : { PICKUP: {allowed:false, isPilot:false},
                         US_MAIL: { allowed:false, isPilot:false}
                       },
                KNW  : { PICKUP: {allowed:false, isPilot:false},
                         US_MAIL: { allowed:false, isPilot:false}
                       },
                OHI  : { PICKUP: {allowed:false, isPilot:false},
                         US_MAIL: { allowed:false, isPilot:false}
                       },
                HAW  : { PICKUP: {allowed:false, isPilot:false},
                         US_MAIL: { allowed:false, isPilot:false}
                       },
                GGA  : { PICKUP: {allowed:false, isPilot:false},
                         US_MAIL: { allowed:false, isPilot:false}
                       }
        },
        PILOT_ENTITLEMENT: "RX_SHPMT_NTFCN_2014_R1"
    },
    NOTIF_TYPES: {
                  PICKUP: "Prescriptions are ready for pick-up",
                  US_MAIL: "Prescriptions are shipped"
                 },
    VALIDATION:{
                 EMAILREGEX : /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
                 MOBILEREGEX : /^\b\d{10}$/,
                 EMAIL_LENGTH :64,
                 MOBILE_LENGTH:10,
                 MOBILEEXTENSION_LENGTH:4
    }
},
CREDIT_CARD: {
    VALIDATIONS: {
        MRN: {
                STARTED: {
                        cardType:["AM", "MS", "VS"], firstName:{min:0, max:14}, lastName:{min:0, max:18}, middleName:{min:0, max:1}
                        },
                NOTSTARTED: {
                        cardType:["AM", "MS", "VS"], firstName:{min:0, max:14}, lastName:{min:0, max:18}, middleName:{min:0, max:1}
                        },
                COMPLETED: { cardType:["AM", "DS", "MS", "VS"],
                            firstName:{min:0, max:20},
                            lastName:{min:0, max:25},
                            middleName:{min:0, max:3}
                           }
               },
        ALL: { cardType:["AM", "DS", "MS", "VS"], firstName:{min:0, max:20}, lastName:{min:0, max:25}, middleName:{min:0, max:3} }
    }
},
ADDRESS: {
    VALIDATIONS: {
        ALL: {
                firstName:    {required: true, min:1, max:40, format: /^[A-Za-z\-\.,\' ]+$/},
                middleName:   {required: false, min:0, max:1, format: /^[a-zA-Z ]+$/},
                lastName:     {required: true, min:1, max:50, format: /^[A-Za-z\-\.,\' ]+$/},
                addressLine1: {required: true, min:2, max:60, format: /^[0-9A-Za-z\-\.,\' /\#&]+$/},
                city:         {required: true, min:2, max:20, format: /^[a-zA-Z ]+$/},
                state:        {required: true, min:2, max:2, format: /^[a-zA-Z ]+$/},
                zip:          {required: true, min:5, max:5, format: /^[0-9]+$/}
        },

        MRN: {
                firstName:    {required: true, min:1, max:40, format: /^[A-Za-z\-\.,\' ]+$/},
                middleName:   {required: false, min:0, max:1, format: /^[a-zA-Z ]+$/},
                lastName:     {required: true, min:1, max:50, format: /^[A-Za-z\-\.,\' ]+$/},
                addressLine1: {required: true, min:2, max:60, format: /^[0-9A-Za-z\-\.,\' /\#&]+$/},
                city:         {required: true, min:2, max:15, format: /^[a-zA-Z ]+$/},
                state:        {required: true, min:2, max:2, format: /^[a-zA-Z ]+$/},
                zip:          {required: true, min:5, max:5, format: /^[0-9]+$/}
        },
    },
    RULES:{
        OUT_OF_STATE: {HAW: ['HI'], KNW:['WA','OR']}

    },
    STATES:[
             {value :'AL'},{value :'AK'},{value :'AZ'},{value :'AR'},{value :'CA'},{value :'CO'},{value :'CT'},{value :'DE'},{value :'DC'},
             {value :'FL'},{value :'GA'},{value :'HI'},{value :'ID'},{value :'IL'},{value :'IN'},{value :'IA'},{value :'KS'},{value :'KY'},
             {value :'LA'},{value :'ME'},{value :'MD'},{value :'MA'},{value :'MI'},{value :'MN'},{value :'MS'},{value :'MO'},{value :'MT'},
             {value :'NE'},{value :'NV'},{value :'NH'},{value :'NJ'},{value :'NM'},{value :'NY'},{value :'NC'},{value :'ND'},{value :'OH'},
             {value :'OK'},{value :'OR'},{value :'PA'},{value :'RI'},{value :'SC'},{value :'SD'},{value :'TN'},{value :'TX'},{value :'UT'},
             {value :'VT'},{value :'VA'},{value :'WA'},{value :'WI'},{value :'WY'}

    ]
},
SPECIAL_INSTRUCTION:{
        charLimit : 250

},
  GOOGLE_API_KEY :{
    CLIENT_ID:"gme-kaiserfoundation"
  },

  /**
    This method is used for getting the cart size based on the region name.
  */
  getFieldLengthByRgn: function(r){
    return this.REFILL_RX_VALIDATION[r] ? this.REFILL_RX_VALIDATION[r] : this.REFILL_RX_VALIDATION['OTHER'];
  },
   getCodeByRegion: function(r){
    return this.REGION_CODE[r] ;
  }
});
