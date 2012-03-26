/*
wishywig.js
Copyright 2012 by Keith P. Graham

This script is intended to be used with the Simple Rich Text Widget.

Use at your own risk. The javascript may not be suitable for other applications and is not tested beyond its use in the Simple Rich Text Widget. The script is not supported and any bugs, even if reported, probably will never be fixed.

wishywig.js is a very lightweight way to make a textarea editable and to display a few icons to control it

=== Simple Rich Text Widget ===
Tags: widget, rich text, contenteditable, gui
Stable tag: 1.1
Requires at least: 2.8
Tested up to: 3.3.1
Contributors: Keith P. Graham
Donate link: http://www.blogseye.com/buy-the-book/


*/
function WISHYWIG() {
	var wishytid=new Array();
	var wishyifr=new Array();
	var wishyifrdiv=new Array();
	var wishyww=new Array();
	var wishyVis= new Array();
	var wishyIcon=new Array();
	var wishyText=new Array();
	var wishyThis=this;
	var wishyIDX=0;
	var wishyLastColorCommand='';
	var wishyRange='';
	var wishyPath='';
	var wishyIDList=new Array();
	var scripts = document.getElementsByTagName("script");
	for (var j=0;j<scripts.length;j++) {
		if (scripts[j].src.indexOf('wishywig.js')>=0) {
			wishyPath=scripts[j].src.substring(0,scripts[j].src.indexOf('wishywig.js'));
			break;
		}
	}

this.wishywig = function(textareaID) {
	// check for reuse of the ids as in Wordpress that creates the ids on the fly
	var idx=-1;
	testing=false;
	var tid;
	if (testing) {
		for (var j=0;j<wishyIDList.length;j++) {
			if (textareaID==wishyIDList[j]) {
				idx=j;
				break;
			}
		}
		if (idx==-1) {
			idx=wishyIDX;
			tid=document.getElementById(textareaID);
			wishytid[idx]=tid;
			wishyIDX++;
		} else {
			tid=document.getElementById(textareaID);
			wishytid[idx]=tid;
		}
	} else {
		idx=wishyIDX;
		tid=document.getElementById(textareaID);
		wishytid[idx]=tid;
		wishyIDX++;
	}
	wishyVis[idx]=false;
	
	// do it again by tag name because wordpress makes copies of the id
	var els=document.getElementsByTagName('textarea');
	var tids=new Array();
	for (var j=0;j<els.length;j++) {
		if (els[j].id==textareaID) {
			tids[tids.length]=els[j];
		}
	}
	// need to create the element that is just prior to the textarea that will hold the icons
	var ww=document.createElement("div");
	// set the div's style and such
	ww.style.height='24px';
	var w=tid.style.width;
	if (w<=0) {
		w=tid.offsetWidth+'px';
	}
	var h=tid.style.height;
	if (h=='') {
		h=tid.offsetHeight+'px';
	}
	if (h=='0px') {
		h='300px';
	}
	ww.style.width=w;
	ww.style.marginLeft=tid.style.marginLeft;
	ww.style.marginRight=tid.style.marginRight;
	ww.style.padding='0px';
	ww.style.backgroundColor='white';
	ww.style.verticalAlign='top';
	ww.style.position='relative';
	ww.style.overflow='visible';
	ww.style.zIndex=1000;
	if (document.all) ww.style.zoom=1;
	wishyww[idx]=ww;
	// prepend to textarea
	tid.parentNode.insertBefore(ww,tid);
	// now start filling it up with icons
	var icons=wishyIcons(idx,wishyPath);
	ww.innerHTML=icons;
	wishyIcon[idx]=icons;
	wishyText[idx]=wishyMakeUnHTML(idx,wishyPath+'images/richtext.gif','Toggle View Rich Text');

	// now we need to create the iframe that replaces the tid
	var ifrdiv=document.createElement("div");
	ifrdiv.id='wishydiv'+idx;
	ifrdiv.style.width=w;
	ifrdiv.style.height=h;
	ifrdiv.style.marginLeft=tid.style.marginLeft;
	ifrdiv.style.marginRight=tid.style.marginRight;
	ifrdiv.style.marginLeft=tid.style.marginLeft;
	ifrdiv.style.marginRight=tid.style.marginRight;
	ifrdiv.style.padding='0px';
	ifrdiv.style.backgroundColor='white';
	ifrdiv.style.verticalAlign='top';
	ifrdiv.style.position='relative';
	ifrdiv.style.zIndex=999;
	ifrdiv.style.display='none';
	ifrdiv.style.border = "thin solid black";
		// this put it in as a node after the textarea
	ifrdiv.style.position='relative';
	if (document.all) ifrdiv.style.zoom=1;
	tid.parentNode.insertBefore(ifrdiv,tid);

	ifrdiv.style.backgroundColor='ivory';
	// put an iframe into the div.
	ifrdiv.innerHTML='<iframe id="wishyframe'+idx+'" name="wishyframe'+idx+'" style="width:100%;height:100%;"></iframe>';
	var ifr=document.getElementById('wishyframe'+idx);
	wishyIDList[idx]='wishyframe'+idx;
	ifr.contentWindow.document.open();
	ifr.contentWindow.document.write("<p>&nbsp;</p>");
	ifr.contentWindow.document.close();
	ifr.onkeyup="alert(\"key\");return true;";
	if (ifr==null||typeof(ifr)!='object') {
		//alert("iframe:"+typeof(ifr));
	}
	//make the iframe editable
	//tid.value='hey hey';
	wishyifr[idx]=ifr;
	wishyifrdiv[idx]=ifrdiv;
	wishyToggleV(idx);
}
// turns edit on or off
function wishySet(idx) {
    var d=wishytid[idx].value;
	// sometimes iE loses the iframe id in Wordpress (redefining?)
	var ifr=document.getElementById(wishyIDList[idx]); // refetch?
	wishyifr[idx]=ifr;
    var editFrame=ifr.contentWindow.document;
	editFrame.designMode = "on";
	//editFrame.body.contentEditable=true; // supposed to help with IE6?
	try {editFrame.execCommand("styleWithCSS",true,true);} catch (e) {}
}
function wishyToggleV(idx) {
	//try {
	    //alert('vis:'+wishyVis[idx]+','+idx+','+wishyVis.length);
		if (wishyVis[idx]==true) {
			// the edit frame is visible switch over to making it invisible.
			// then make the textbox visible
			wishyifrdiv[idx].style.display='none';
			wishyww[idx].innerHTML=wishyText[idx];
			wishyVis[idx]=false;
			wishytid[idx].style.display='block';
			var copyContent="";			
			if ( wishyifr[idx].contentDocument ) { // FF
				 copyContent = wishyifr[idx].contentDocument.body.innerHTML;
			   } else if ( wishyifr[idx].contentWindow ) { // IE
				 copyContent = wishyifr[idx].contentWindow.document.getElementsByTagName('body')[0].innerHTML;
				 //alert(copyContent);
			}
			if (copyContent=='') copyContent='<p>&nbsp;</p>';
			wishytid[idx].value=copyContent;
			//wishyAppend(idx,"In true "+idx);
		} else {
			//here the textarea is visible - flip it over to the iframe
			wishyifrdiv[idx].style.display='block'; 
			wishyww[idx].innerHTML=wishyIcon[idx];
			wishyVis[idx]=true;
			wishytid[idx].style.display='none';
			var copyContent=wishytid[idx].value;
			if (copyContent=='') copyContent='<p>&nbsp;</p>';
			//alert(copyContent);
			if ( wishyifr[idx].contentDocument ) { // FF
				  wishyifr[idx].contentDocument.body.innerHTML=copyContent;
			   } else if ( wishyifr[idx].contentWindow ) { // IE
				 wishyifr[idx].contentWindow.document.write(copyContent);
				 //alert(copyContent);
			}			
			
			wishySet(idx);
			setKeyEvent(idx);
			try {
			wishyifr[idx].focus();
			wishyww[idx].focus();
			wishyifr[idx].focus();
			} catch (e) {}
		}
	//} catch (e) {
	//    alert("toggle "+this.wishyVis[idx]+" - "+e);
	//}
    return false;
}



// edit functions
function wishyMake(idx,command,img,alt) {
var ansa='<a href="#" onclick="return WishyWig.wishyCommand('+idx+',\''+command+'\',\'\');"><img style="margin:-2;padding:0;" src="'+img+'" alt="'+alt+'" title="'+alt+'" border="0" /></a>';
	return ansa;
}

function wishyMakeColor(idx,command,img,alt) {
var ansa='<a href="#" onclick="return WishyWig.wishyColor('+idx+',\''+command+'\');"><img style="margin:-2;padding:0;" src="'+img+'" alt="'+alt+'" title="'+alt+'" border="0" /></a>';
	// add the drop down color table
	ansa+=wishyColorTable(idx,'wmkT'+command+idx);
	return ansa;
}

function wishyMakeLink(idx,img,alt) {
var ansa='<a href="#" onclick="return WishyWig.wishyLink('+idx+');"><img style="margin:-2;padding:0;" src="'+img+'" alt="'+alt+'" title="'+alt+'" border="0" /></a>';
	return ansa;
}
function wishyMakeFont(idx,img,alt) {
var ansa='<a href="#" onclick="return WishyWig.wishyFontFamily('+idx+');"><img style="margin:-4;padding:0;" src="'+img+'" alt="'+alt+'" title="'+alt+'" border="0" /></a>';
	ansa+=wishyFontTable(idx,'wmkF'+idx);
	return ansa;
}
function wishyMakeFontSize(idx,img,alt) {
var ansa='<a href="#" onclick="return WishyWig.wishyFontSize('+idx+');"><img style="margin:-3;padding:0;" src="'+img+'" alt="'+alt+'" title="'+alt+'" border="0" /></a>';
	ansa+=wishyFontSizeTable(idx,'wmkFS'+idx);
	return ansa;
}
function wishyMakeHTML(idx,img,alt) {
var ansa='<a href="#" onclick="return WishyWig.wishyHTML('+idx+');"><img style="padding:0;" src="'+img+'" alt="'+alt+'" title="'+alt+'" border="0" /></a>';
	return ansa;
}
function wishyMakeUnHTML(idx,img,alt) {
var ansa='<a href="#" onclick="return WishyWig.wishyHTML('+idx+');"><img style="padding:0;" src="'+img+'" alt="'+alt+'" title="'+alt+'" border="0" /></a>';
	return ansa;
}

function wishyIcons(idx,url) {
	// fill er up
	var icons='';
	icons+=wishyMake(idx,'bold',url+'images/bold.gif','Bold');
	icons+=wishyMake(idx,'underline',url+'images/underline.gif','Underline');
	icons+=wishyMake(idx,'italic',url+'images/italic.gif','Italic');
	icons+=wishyMake(idx,'justifyleft',url+'images/j_left.gif','Align Left');
	icons+=wishyMake(idx,'justifycenter',url+'images/j_center.gif','Align Center');
	icons+=wishyMake(idx,'justifyright',url+'images/j_right.gif','Align Right');
	icons+=wishyMake(idx,'indent',url+'images/indent.gif','Indent');
	icons+=wishyMake(idx,'outdent',url+'images/outdent.gif','Outdent');
	icons+=wishyMakeFont(idx,url+'images/font.jpg','Font Family');
	icons+=wishyMakeFontSize(idx,url+'images/fontsize.jpg','Font Size');
	icons+=wishyMakeColor(idx,'backColor',url+'images/bgcolor.gif','Background Color');
	icons+=wishyMakeColor(idx,'foreColor',url+'images/textcolor.gif','Text Color');
	icons+=wishyMakeLink(idx,url+'images/hyperlink.gif','Hyperlink');
	icons+=wishyMake(idx,'RemoveFormat',url+'images/removeformat.gif','Remove Format');
	icons+=wishyMakeHTML(idx,url+'images/view_source.gif','Toggle View Source');
/*
<a href="#" onclick="return WishyWig.wishySpecialChar();"><img src="images/specialchars.jpg" alt="Insert Special Characters" title="Insert Special Characters" border="0" /></a>
<a href="#" onclick="return WishyWig.wishyCommand('undo','');"><img src="images/undo.gif" alt="Undo" title="Undo" border="0" /></a>
<a href="#" onclick="return WishyWig.wishyCommand('redo','');"><img src="images/redo.gif" alt="Redo" title="Redo" border="0" /></a>
border="0" /></a>
*/	
	return icons;

}
function setKeyEvent(idx) {
//contentWindow.document.body
	var iframeDoc = wishyifr[idx].contentDocument || wishyifr[idx].contentWindow.document;

 	if (typeof iframeDoc.attachEvent != "undefined") { //IE This works
		iframeDoc.attachEvent('onkeyup', function() { parent.WishyWig.wishyCopy(idx); }); // works for IE
		//wishyifr[idx].attachEvent('onblur', function() { parent.WishyWig.wishyReset(idx); }); // works for IE
		//wishyifr[idx].attachEvent('onfocus', function() { parent.WishyWig.wishyReset(idx); }); // works for IE
		iframeDoc.attachEvent('onclick', function() { parent.WishyWig.wishyReset(idx); }); // works for IE
	} else if (typeof iframeDoc.addEventListener != "undefined") { //FF doesn't work
		wishyifr[idx].contentWindow.document.addEventListener('keyup', function() { parent.WishyWig.wishyCopy(idx);}, false);
		wishyifr[idx].contentWindow.document.addEventListener('blur', function() { parent.WishyWig.wishyReset(idx);}, false);
		wishyifr[idx].contentWindow.document.addEventListener('focus', function() { parent.WishyWig.wishyReset(idx);}, false);
	}

}
this.wishyCopy=function(idx) {
	return localCopy(idx);
}
this.wishyReset=function(idx) {
	wishySet(idx);
	 //alert("reset");
	return false;

}
function localCopy(idx) {
	// backup a copy of the iframe to the text box on every keystroke
	var copyContent="";			
	if ( wishyifr[idx].contentDocument ) { // FF
		 copyContent = wishyifr[idx].contentDocument.body.innerHTML;
	   } else if ( wishyifr[idx].contentWindow ) { // IE
		 copyContent = wishyifr[idx].contentWindow.document.getElementsByTagName('body')[0].innerHTML;
		 //alert(copyContent);
	}
	if (copyContent=='') copyContent='<p>&nbsp;</p>';
	wishytid[idx].value=copyContent;
	//wishySet(idx);
	return false;
}
// commands to do the wishy stuff
this.wishyLink=function(idx) {
	var newlink='';
	if (!document.all) {
		newlink=prompt('Enter the URL of the Link', 'http://');
		if ( newlink=='' || newlink==null || newlink=='http://'  ) {
			return false; 
		} 
	}
    doCommand(idx,'CreateLink', newlink);
	return false;
}
this.wishyCommand=function(idx,command, option) {
	return doCommand(idx,command,option);
}
function doCommand(idx,command,option) {
	//alert(command);
	//	alert(idx+", command: "+command+", "+option);
	if (command=='backColor' && !document.all) {
		command='hilitecolor';
	}
	try {
		var contentArea = wishyifr[idx].contentWindow;

		//var contentArea = wishyifr[idx].contentWindow;
		contentArea.focus();
		var ui=false;
		if (command=='CreateLink'&&document.all) ui=true;
		var e=contentArea.document.execCommand(command, ui, option);
		//if (!e) alert("command did not work");
		wishyUnselSel(contentArea);
		contentArea.focus();
	} catch (e) { 
		alert("command: "+command+", "+option+", "+e);
	}
	localCopy(idx);
	return false;
}
function wishyUnselSel(ca){
	var moz=document.getElementById&&!document.all;

	if(!moz){
		oTextRange = ca.document.selection.createRange()
		oTextRange.expand("word")
		oTextRange.execCommand("unselect")
	} else {
		oTextRange = ca.getSelection()
		oTextRange.collapseToStart()
	}
}

this.wishyHTML =function (idx) {
 	wishyToggleV(idx);
    return false;

}

this.wishyColor=function(idx,command) {
	// make the right table visible
	if (document.all) {
		var contentArea = wishyifr[idx].contentWindow;
		var selection = contentArea.document.selection;
		wishyRange = selection.createRange();
	}

	var id='wmkT'+command+idx;
	var pc=document.getElementById(id);
	pc.style.display='inline';
	wishyLastColorCommand=command;
	return false;
}
this.wishyFontFamily=function(idx) {
	if (document.all) {
		var contentArea = wishyifr[idx].contentWindow;
		var selection = contentArea.document.selection;
		wishyRange = selection.createRange();
	}
	var id='wmkF'+idx;
	var pc=document.getElementById(id);
	pc.style.display='inline';
	return false;
}
this.wishyFontSize=function(idx) {
	if (document.all) {
		var contentArea = wishyifr[idx].contentWindow;
		var selection = contentArea.document.selection;
		wishyRange = selection.createRange();
	}
	var id='wmkFS'+idx
	var pc=document.getElementById(id);
	pc.style.display='inline';
	return false;
}
function wishyFontSizeTable(idx,id) {
	var wfonts=new Array("xx-small","x-small","small","medium","large","x-large","xx-large");
	ansa='\r\n<table id="'+id+'" cellspacing="0" cellpadding="0" style="position:absolute;display:none;background-color:white;top:0;left:100px;">';
	for (j=0;j<7;j++) {
	    var fsize=wfonts[j];
		ansa+='\r\n<tr>\r\n';
		ansa+='<td style="border-bottom:black thin solid;font-size:'+fsize+';background-color:white;" onclick="return WishyWig.wishyPickFontSize('+idx+',\''+(j+1) +'\',\''+id+'\')" >Font Size: '+fsize+'</td>\r\n';
		ansa+='\r\n</tr>\r\n';	
	}
	ansa+='<tr><td align="center"><a href="" onclick="return WishyWig.wishyPickSize(\''+id+'\');">close</a></td></tr></table>';
	return ansa;

}

function wishyFontTable(idx,id) {
	var wfonts=new Array("Arial, Helvetica, sans-serif","'Arial Black', Gadget, sans-serif","'Comic Sans MS', cursive","'Courier New', Courier, monospace","Georgia, serif","'Lucida Sans Unicode', 'Lucida Grande', sans-serif","Impact, Charcoal, sans-serif","'Palatino Linotype', 'Book Antiqua', Palatino, serif","Tahoma, Geneva, sans-serif","'Times New Roman', Times, serif","Trebuchet MS, Helvetica, sans-serif","Verdana, Geneva, sans-serif");
	ansa='\r\n<table id="'+id+'" cellspacing="0" cellpadding="0" style="position:absolute;display:none;background-color:white;top:0;left:100px;">';
	for (j=0;j<wfonts.length;j++) {
	    font=wfonts[j];
		//font=font.replace("'","\\\'");
		font=font.replace(/'/g, "\\\'");
		ansa+='\r\n<tr>\r\n';
		ansa+='<td style="border-bottom:black thin solid;font-family:'+font+';background-color:white;" onclick="return WishyWig.wishyPickFont('+idx+',\''+font +'\',\''+id+'\')" >'+wfonts[j]+'</td>\r\n';
		ansa+='\r\n</tr>\r\n';
	}
	ansa+='<tr><td align="center"><a href="" onclick="return WishyWig.wishyPickHide(\''+id+'\');">close</a></td></tr></table>';
	return ansa;
}
function wishyColorTable(idx,id) {
	// 216 web safe colors
    var wcolors=new Array(
	"000000","000033","000066","000099","0000cc","0000ff","003300","003333","003366","003399","0033cc","0033ff","006600","006633","006666","006699","0066cc","0066ff","009900","009933","009966","009999","0099cc","0099ff","00cc00","00cc33","00cc66","00cc99","00cccc","00ccff","00ff00","00ff33","00ff66","00ff99","00ffcc","00ffff","330000","330033","330066","330099","3300cc","3300ff","333300","333333","333366","333399","3333cc","3333ff","336600","336633","336666","336699","3366cc","3366ff","339900","339933","339966","339999","3399cc","3399ff","33cc00","33cc33","33cc66","33cc99","33cccc","33ccff","33ff00","33ff33","33ff66","33ff99","33ffcc","33ffff","660000","660033","660066","660099","6600cc","6600ff","663300","663333","663366","663399","6633cc","6633ff","666600","666633","666666","666699","6666cc","6666ff","669900","669933","669966","669999","6699cc","6699ff","66cc00","66cc33","66cc66","66cc99","66cccc","66ccff","66ff00","66ff33","66ff66","66ff99","66ffcc","66ffff","990000","990033","990066","990099","9900cc","9900ff","993300","993333","993366","993399","9933cc","9933ff","996600","996633","996666","996699","9966cc","9966ff","999900","999933","999966","999999","9999cc","9999ff","99cc00","99cc33","99cc66","99cc99","99cccc","99ccff","99ff00","99ff33","99ff66","99ff99","99ffcc","99ffff","cc0000","cc0033","cc0066","cc0099","cc00cc","cc00ff","cc3300","cc3333","cc3366","cc3399","cc33cc","cc33ff","cc6600","cc6633","cc6666","cc6699","cc66cc","cc66ff","cc9900","cc9933","cc9966","cc9999","cc99cc","cc99ff","cccc00","cccc33","cccc66","cccc99","cccccc","ccccff","ccff00","ccff33","ccff66","ccff99","ccffcc","ccffff","ff0000","ff0033","ff0066","ff0099","ff00cc","ff00ff","ff3300","ff3333","ff3366","ff3399","ff33cc","ff33ff","ff6600","ff6633","ff6666","ff6699","ff66cc","ff66ff","ff9900","ff9933","ff9966","ff9999","ff99cc","ff99ff","ffcc00","ffcc33","ffcc66","ffcc99","ffcccc","ffccff","ffff00","ffff33","ffff66","ffff99","ffffcc","ffffff");
	ansa='<table id="'+id+'" cellspacing="0" cellpadding="0" style="position:absolute;display:none;top:0;left:100px;">';
	for (j=0;j<wcolors.length/12;j++) {
		ansa+='\r\n<tr>\r\n';
		for (k=0;k<12;k++) {
			ansa+='<td  style="width:16px;height:8px;" onclick="WishyWig.wishyPickColor('+idx+',\'#'+wcolors[(j*12)+k] +'\',\''+id+'\');return false;"  bgcolor="#'+wcolors[(j*12)+k] +'"></td>\r\n';
		}
		ansa+='</tr>';
	}
	ansa+='<tr><td colspan=6 align="center"><a href="" onclick="return WishyWig.wishyPickHide(\''+id+'\');">close</a></td></tr></table>';
	return ansa;
}
this.wishyPickHide=function(id) {
   var pc=document.getElementById(id);
   pc.style.display='none';
	return false;
}
this.wishyPickFont=function(idx,font,id) {
   var pc=document.getElementById(id);
   pc.style.display='none';
	if (document.all) {
		wishyRange.select();
	}
	doCommand(idx,'FontName', font);
	return false;
}
this.wishyPickFontSize=function(idx,font,id) {
   var pc=document.getElementById(id);
   pc.style.display='none';
	if (document.all) {
		wishyRange.select();
	}
	doCommand(idx,'fontsize', font);
	return false;
}
this.wishyPickColor=function(idx,c,id) {
// color is picked (c) now do the command
	if (document.all) {
		wishyRange.select();
	}
   var pc=document.getElementById(id);
   pc.style.display='none';
 	doCommand(idx,wishyLastColorCommand,c);
   //}
   
	return false;
}

} // end of class
	if (typeof(WishyWig)=='undefined') 
		WishyWig=new WISHYWIG();


