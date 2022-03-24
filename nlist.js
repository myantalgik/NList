//a class that takes a nested list container a list of files
class NList{
    static FILE_ID_PREPEND="nlistfile_";
    static NEW_FILE_IDX=100;
    constructor(listElem,data){
        this.listElem=listElem;
        this.data=data;
        this.menu=listElem.children[0];
        this.selectedFile=null;
        this.build();
        this.bindEvents();
    }

    build(){
        //clear list
        //this.listElem.innerHTML="";
        //loop through data and fill list files
        for(let i=0;i<this.data.length;i++){
            let file=this.data[i];
            if(file.type=="file"){//file
                let fileElem=this.makeFileElem(file.name);
                fileElem.id=NList.FILE_ID_PREPEND+file.id;
                let parentElem=file.parent===0?this.listElem:document.getElementById(NList.FILE_ID_PREPEND+file.parent).nextElementSibling;
                if(parentElem){
                    parentElem.appendChild(fileElem);
                }
            }else{//folder
                let fileElem=this.makeFolderElem(file.name);
                fileElem.id=NList.FILE_ID_PREPEND+file.id;
                let filesListElem=this.makeFilesListElem();
                let parentElem=file.parent===0?this.listElem:document.getElementById(NList.FILE_ID_PREPEND+file.parent).nextElementSibling;
                if(parentElem){
                    parentElem.appendChild(fileElem);
                    parentElem.appendChild(filesListElem);
                }
            }
        }
    }

    bindEvents(){
        //click events
        this.listElem.addEventListener("click",(e)=>{
            let target=e.target;
            if(this.menu.style.display=="block")this.menu.style.display="none";
            if(target.classList.contains("bi-caret-right")||target.classList.contains("bi-caret-down")){//toggle folder files list
                this.onToggleFolderContents(target.parentElement);
            }else if(target.classList.contains("file")||target.classList.contains("folder")||target.classList.contains("fileName")||target.classList.contains("fileIcon")){//select file
                this.onTapOnFile(target);
            }else if(target.classList.contains("nlist_container")){
                this.deselectSelectedFile();
            }
        });
        this.menu.addEventListener("click",(e)=>{
            let buttonRole=e.target.dataset.role;
            if(buttonRole){
                if(buttonRole=="newfile"){
                    this.onAddFile("file");
                }else if(buttonRole=="newfolder"){
                    this.onAddFile("folder");
                }else if(buttonRole=="rename"){
                    this.onRenameFile();
                }else if(buttonRole=="delete"){
                    this.onDeleteFile();
                }
            }
        });
        //contextmenu event
        this.listElem.addEventListener("contextmenu",(e)=>{
            e.preventDefault();
            let target=e.target;
            if(target.classList.contains("nlist_container")){
                this.deselectSelectedFile();
            }
            //if target is file or folder select it
            if(target.classList.contains("file")||target.classList.contains("folder")||target.classList.contains("fileName")||target.classList.contains("fileIcon")){//select file
                this.onTapOnFile(target);
            }
            //open menu
            this.onOpenMenu(e,target.classList.contains("file")&&!target.classList.contains("folder"),target.classList.contains("folder"),target.classList.contains("nlist_container"));
        });
    }

    makeFileElem(name){
        let file=document.createElement("span");
        file.className="file";
        let fileIcon=document.createElement("i");
        fileIcon.className="bi-file-earmark fileIcon";
        let fileName=document.createElement("span");
        fileName.className="fileName";
        fileName.innerText=name;
        file.appendChild(fileIcon);
        file.appendChild(fileName);
        return file;
    }

    makeFolderElem(name){
        let file=document.createElement("span");
        file.className="file folder";
        let fileIcon=document.createElement("i");
        fileIcon.className="bi-folder fileIcon";
        let fileName=document.createElement("span");
        fileName.className="fileName";
        fileName.innerText=name;
        let caretIcon=document.createElement("i");
        caretIcon.className="bi-caret-right fileIcon";
        file.appendChild(fileIcon);
        file.appendChild(fileName);
        file.appendChild(caretIcon);
        return file;
    }

    makeFilesListElem(){
        let filesList=document.createElement("div");
        filesList.className="filesList";
        return filesList;
    }
    //actions
    addFile(file){
        this.data.push(file);
        if(file.type=="file"){
            let fileElem=this.makeFileElem(file.name);
            fileElem.id=NList.FILE_ID_PREPEND+file.id;
            let parentElem=file.parent===0?this.listElem:document.getElementById(NList.FILE_ID_PREPEND+file.parent).nextElementSibling;
            if(parentElem){
                parentElem.appendChild(fileElem);
            }
        }else{
            let fileElem=this.makeFolderElem(file.name);
            fileElem.id=NList.FILE_ID_PREPEND+file.id;
            let filesListElem=this.makeFilesListElem();
            let parentElem=file.parent===0?this.listElem:document.getElementById(NList.FILE_ID_PREPEND+file.parent).nextElementSibling;
            if(parentElem){
                parentElem.appendChild(fileElem);
                parentElem.appendChild(filesListElem);
            }
        }
    }
    renameFile(file,newName){
        let fileElem=document.getElementById(NList.FILE_ID_PREPEND+file.id);
        if(fileElem){
            file.name=newName;
            fileElem.children[1].innerText=newName;
        }
    }
    deleteFile(file){
        let fileElem=document.getElementById(NList.FILE_ID_PREPEND+file.id);
        if(fileElem){
            if(this.selectedFile==file)this.selectedFile=null;
            this.data=this.data.filter((f)=>f.id!==file.id||f.parent===file.id);
            if(file.type=="folder")fileElem.nextElementSibling.parentElement.removeChild(fileElem.nextElementSibling);
            fileElem.parentElement.removeChild(fileElem);
        }
    }

    //events
    onOpenMenu(e,targetIsFile,targetIsFolder,targetIsListContainer){
        this.menu.children[0].style.display=!targetIsFile||targetIsFolder?"block":"none";
        this.menu.children[1].style.display=!targetIsFile||targetIsFolder?"block":"none";
        this.menu.children[2].style.display=!targetIsListContainer?"block":"none";
        this.menu.children[3].style.display=!targetIsListContainer?"block":"none";
        let nlistRect=this.listElem.getBoundingClientRect();
        let xpos=11;
        let ypos=e.clientY-nlistRect.y;
        this.menu.style.left=xpos+"px";
        this.menu.style.top=ypos+"px";
        this.menu.style.display="block";
    }
    onToggleFolderContents(folderElem){//toggle collapse
        let folderFilesListElem=folderElem.nextElementSibling;
        if(folderFilesListElem.classList.contains("collapsed")){
            folderFilesListElem.classList.remove("collapsed");//remove collapsed class if is collapsed
            folderElem.children[2].style.transform="rotate(0deg)";
        }else{
            folderFilesListElem.classList.add("collapsed");//add collapsed class if not collapsed
            folderElem.children[2].style.transform="rotate(90deg)";
        }
    }
    onTapOnFile(fileElem){
        let fileElemIDStr=fileElem.classList.contains("file")?fileElem.id:fileElem.parentElement.id;
        let fileId=parseInt(fileElemIDStr.split("_")[1]);
        let file=this.data.find((f)=>f.id===fileId);
        if(file){
            if(this.selectedFile)document.getElementById(NList.FILE_ID_PREPEND+this.selectedFile.id).classList.remove("selected");
            document.getElementById(NList.FILE_ID_PREPEND+file.id).classList.add("selected");
            this.selectedFile=file;
        }
    }
    onAddFile(fileType="file"){
        const fileTypeCap=fileType=="file"?"File":"Folder";
        if(this.selectedFile){
            let fileName=prompt(fileTypeCap+" Name >");
            this.addFile({id:NList.NEW_FILE_IDX++,name:fileName,type:fileType,parent:this.selectedFile.id});
        }else{
            let fileName=prompt(fileTypeCap+" Name >");
            this.addFile({id:NList.NEW_FILE_IDX++,name:fileName,type:fileType,parent:0});
        }
    }
    onRenameFile(){
        if(this.selectedFile){
            let newFileName=prompt("New Name >");
            this.renameFile(this.selectedFile,newFileName);
        }
    }
    onDeleteFile(){
        if(this.selectedFile){
            if(confirm("Delete selected file?")){
                this.deleteFile(this.selectedFile);
            }
        }
    }

    //helpers
    deselectSelectedFile(){
        if(this.selectedFile){
            document.getElementById(NList.FILE_ID_PREPEND+this.selectedFile.id).classList.remove("selected");
            this.selectedFile=null;
        }
    }

}