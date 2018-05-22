import { EntryPoint } from "./EntryPoint";
declare var global: any;

global.test = function test ():void {
    var entryPoint:EntryPoint = new EntryPoint();
    entryPoint.Start();
};