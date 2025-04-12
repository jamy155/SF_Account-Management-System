import { MessageContext, subscribe } from 'lightning/messageService';
import { LightningElement , wire } from 'lwc';
import Comrevo from '@salesforce/messageChannel/Comrevo__c';


export default class ShowAccountContacts extends LightningElement {

    subscription = null;
    @wire (MessageContext) messageContext;

    accountId;
    accountName;

    connectedCallback() {
        this.handleSubscribe();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    handleSubscribe() {
        if(!this.subscription) 
            {
                this.subscription = subscribe(this.messageContext,Comrevo, 
                    (param)=>
                        {
                            this.accountId = param.accountId;
                            this.accountName = param.accountName;
                        })
            
            }
    }

    handleUnsubscribe() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}