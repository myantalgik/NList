/*const folders=document.getElementsByClassName("folder");
for(let i=0;i<folders.length;i++){
    let folder=folders[i];
    folder.addEventListener("click",()=>onTapOnFolder(folder));
}

function onTapOnFolder(folder){
    let folderFilesList=folder.nextElementSibling;
    if(folderFilesList.classList.contains("collapsed")){
        folderFilesList.classList.remove("collapsed");//remove collapsed class if is collapsed
    }else{
        folderFilesList.classList.add("collapsed");//add collapsed class if not collapsed
    }
}*/

//data: array of files
const data=[
    {id:1,name:"Root",type:"folder",parent:0},
    {id:2,name:"TestFile",type:"file",parent:0},
];
const nlist=new NList(document.getElementById("nlist"),data);
