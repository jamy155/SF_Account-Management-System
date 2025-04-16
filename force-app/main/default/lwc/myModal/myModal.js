import { api, wire } from 'lwc';
import LightningModal from 'lightning/modal';



export default class MyModal extends LightningModal {
    @api content;
    @api modalHeader;
    @api isAddContact;
    @api isEditContact;
    @api recordId;
    @api accountId;
    @api editableContactId;


    handleOkay() {
        this.close('okay');
    }

}