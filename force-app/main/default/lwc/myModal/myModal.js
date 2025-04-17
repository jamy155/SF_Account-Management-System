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

    message = "Your attempt to delete this contact could not be completed because it is associated a case";


    handleOkay() {
        this.close('okay');
    }

}