var leavebehindPopunderMixin = {
    data: function () {
        return {
            popUnderOpenStatus: false
        }
    },
    methods: {
        openPopUnder: function(url){
            url = (typeof url !== 'undefined') ?  url : '';

            var width = screen.width - 100;
            var height = screen.height - 100;
            if(url == '' && this.popUnderOpenStatus == false && this.popUnder == true){
                this.createdWindowObject = window.open(url, "_blank", "width=5, height=5, left=" + width +", top=" + height + ", resizable=yes, toolbar=no, location=no, directories=no, status=no");
                this.popUnderOpenStatus = true;
            }else if(url != '' && this.popUnder == true){
                this.createdWindowObject.window.location.href = url;
                this.createdWindowObject.moveTo(0, 0);
                this.createdWindowObject.resizeTo(screen.availWidth-40, screen.availHeight-40);
            }
        },
        fillPopUnder: function(){
            this.openPopUnder(this.setPropertyRedirectURL(this.popUnderBrand, 'pu'));
        },
        openLeaveBehind: function(){
            if(this.checkboxCheckedStatus){
                window.open(this.setPropertyRedirectURL(this.leaveBehindBrand, 'lb'), "_self");
            }else{
                window.open(this.setPropertyRedirectURL(this.leaveBehindBrandWhileUncheck, 'lb'), "_self");
            }
        },
        /**
         * This function will generate property redirect url
         */
        setPropertyRedirectURL: function(brandName, redirectType){
            var full_affiliate_url = '';
            switch(brandName){
                case 'homeaway':
                    full_affiliate_url = this.homeawayAffiliate(redirectType);
                    break;
                case 'vrbo':
                    full_affiliate_url = this.vrboAffiliate(redirectType);
                    break;
                case 'booking':
                    full_affiliate_url = this.bookingAffiliate(redirectType);
                    break;
            }
            return full_affiliate_url;
        },
        homeawayVrboCommon: function(brandname, redirectType){
            var affurl = 'https://prf.hn/click' + '/camref:' + common_info.cam_ref[brandname] + '/pubref:' + common_info.pub_ref;
            var sid_label = this.getFeedAlternateLabelSid(common_info.event_type[redirectType], common_info.property_id[redirectType]);
            affurl += sid_label;
            affurl += '/[siteid:' + common_info.siteid[brandname] + '/feed:' + common_info.feed[brandname] + '/sf:' + common_info.subfeed[brandname] + ']';
            return {
                affiliateUrl: affurl,
                sidLabel: sid_label
            };
        },
        /**
         * This function will generate homeaway affiliate url
         */
        homeawayAffiliate: function(redirectType){
            var data = new this.homeawayVrboCommon('homeaway', redirectType);
            var affurl = data.affiliateUrl;
            var sid_label = data.sidLabel;
            affurl += '/destination:https%3A%2F%2Fwww.homeaway.com%2Fresults%2Fkeywords%3A';
            affurl += this.searchInputValue;
            if(typeof this.checkInDateInputValue !== 'undefined' && this.checkInDateInputValue != null && this.checkInDateInputValue !== '' && this.checkOutDateInputValue !== 'undefined' && this.checkOutDateInputValue !== null && this.checkOutDateInputValue !== ''){
                affurl += '%2Farrival%3A' + this.checkInDateInputValue + '%2Fdeparture%3A' + this.checkOutDateInputValue;
            }
            affurl += '%3Fsid%3D' + common_info.site_name.toLowerCase() + sid_label;
            return affurl;
        },
        /**
         * This function will generate vrbo affiliate url
         */
        vrboAffiliate: function(redirectType){
            var data = new this.homeawayVrboCommon('vrbo', redirectType);
            var affurl = data.affiliateUrl;
            var sid_label = data.sidLabel;
            affurl += '/destination:https%3A%2F%2Fwww.vrbo.com%2Fresults%3F';
            affurl += 'q%3D' + this.searchInputValue;
            if(typeof this.checkInDateInputValue !== 'undefined' && this.checkInDateInputValue != null && this.checkInDateInputValue !== '' && this.checkOutDateInputValue !== 'undefined' && this.checkOutDateInputValue !== null && this.checkOutDateInputValue !== ''){
                affurl += '%26from-date%3D' + this.checkInDateInputValue + '%26to-date%3D' + this.checkOutDateInputValue;
            }
            affurl += '&sid=' + common_info.site_name.toLowerCase() + sid_label;
            return affurl;
        },
        /**
         * This function will generate booking affiliate url
         */
        bookingAffiliate: function(redirectType){
            var affurl = 'https://www.booking.com/searchresults.html?aid=' + common_info.bc_affiliate + '&lang=en-us&utm_term=hotel-&selected_currency=' + common_info.site_currency;
            affurl += '&ss=' + this.searchInputValue;
            var sid_label = this.getFeedAlternateLabelSid(common_info.event_type[redirectType], common_info.property_id[redirectType]);
            affurl += '&label=' + common_info.site_name.toLowerCase() + sid_label;
            if(typeof this.checkInDateInputValue !== 'undefined' && this.checkInDateInputValue != null && this.checkInDateInputValue !== '' && this.checkOutDateInputValue !== 'undefined' && this.checkOutDateInputValue !== null && this.checkOutDateInputValue !== ''){
                affurl += '&checkin=' + this.checkInDateInputValue + '&checkout=' + this.checkOutDateInputValue;
            }
            return affurl;
        },
        /**
         * This function will generate label alt sid
         * @param {*} et for event type
         * @param {*} pid for property id
         */
        getFeedAlternateLabelSid: function(et, pid) {
            if(this.oz_u_token_base64 == 'oztokentodo'){
                this.updateOzToken();
            }
            var label_alt_sid = '--d-' + (common_info.general.device_type || '') + '_page-' + common_info.controller_id;
            var search_str = this.searchInputValue.replace(/\,/g, '');
            label_alt_sid += '_search-' + encodeURI(search_str);
            label_alt_sid += '_et-' + et;
            label_alt_sid += '_hotel-' + pid;
            label_alt_sid += '_oztoken_' + (this.oz_u_token_base64 || '');
            return label_alt_sid;
        }
    }
};