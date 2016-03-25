export default class StubState{
    constructor(uriStringResult){
        this.uriStringResult = uriStringResult;
    }
    toUriString(){
        return this.uriStringResult;
    }
}