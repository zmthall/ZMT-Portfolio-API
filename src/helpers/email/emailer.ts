import { NoReplyEmail } from './noReplyEmail.js';
import { MainEmail } from './mainEmail.js';

export class Emailer {
    static readonly noreply = new NoReplyEmail();
    static readonly main = new MainEmail();
}