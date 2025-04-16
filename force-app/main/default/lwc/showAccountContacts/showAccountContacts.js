import { MessageContext, subscribe } from 'lightning/messageService';
import { LightningElement , wire } from 'lwc';
import Comrevo from '@salesforce/messageChannel/Comrevo__c';
import getAccContacts from '@salesforce/apex/AccountClass.getAccContacts';
import MyModal from 'c/myModal';

export default class ShowAccountContacts extends LightningElement {

    subscription = null;
    title = "Contacts";
    contacts;
    hasContacts;
    isAccountSelected = false;



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
                            this.title = param.accountName+"'s Contacts";
                            this.getContacts();
                        })
            
            }
    }

    handleUnsubscribe() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    async getContacts() {
        this.contacts =  await getAccContacts({accId: this.accountId});
        this.hasContacts = this.contacts.length > 0? true:false;
        this.isAccountSelected = true; 
    }

    async handleAddContact() {
        const result = await MyModal.open({
            modalHeader: "Add Contact",
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
            isAddContact: true,
            isEditContact: false,
            isDeleteContact: false,
            accountId: this.accountId
        }).then(result => {
                this.getContacts();
        });
    }

    async handleEditContact() {
        const result = await MyModal.open({
            modalHeader: "Edit Contact",
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
            isAddContact: false,
            isEditContact: true,
            isDeleteContact: false,
            editableContactId: event.target.dataset.contactId
        }).then(result => {
                this.getContacts();
        });
    }

    async handleDeleteContact() {
        const result = await MyModal.open({
            modalHeader: "Delete Contact",
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
            isAddContact: false,
            isEditContact: false,
            isDeleteContact: true
        });
    }



}