/*
    create a new type called listItem using interface keyword
    and it has 3 keys and the type for their values
    1. id: string
    2. checked: boolean
    3. data: string
*/
interface listItem {
    id: number,
    onChecked: boolean,
    item: string,
}
type partialListItemType = Partial<listItem>[];
// get all listItems stored in the local storage
const localStorageValue: string = (localStorage.getItem("listItems") as unknown) as string;
const allListItems: listItem[] | partialListItemType = JSON.parse(localStorageValue) || [];


/*
    The CREATE OPERATION in CRUD
    get the span element and put an event listener
    such that a click on it would run the addListItem
    function.
*/
const spanToAdd: HTMLDivElement = <HTMLDivElement>document.querySelector(".span-to-add");
const inputAdd: HTMLInputElement = <HTMLInputElement>document.getElementById("add-item");
const addListItem = (item: listItem, listItemArray: partialListItemType, inputElement: HTMLInputElement): void => {
    const newListItemArray: partialListItemType = [...listItemArray, item];
    localStorage.setItem("listItems", JSON.stringify(newListItemArray));
    window.location.reload();
    inputElement.focus();
}
inputAdd.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
        // put a type guard here before getting the id of the last object in the array of allListItems
        let newId: number;
        if (typeof allListItems[allListItems.length - 1] === "undefined") {
            newId = 0;
        } else {
            newId = (allListItems[allListItems.length - 1].id as unknown) as number + 1;
        }
        if (inputAdd.value === "") return;
        const newItem: listItem = {
            id: newId,
            onChecked: false,
            item: inputAdd.value,
        }
        addListItem(newItem, allListItems, inputAdd);
    }
});

spanToAdd.addEventListener("click", (e) => {
    console.log(e.currentTarget);
    // get the input element
    const inputAdd: HTMLInputElement = <HTMLInputElement>document.getElementById("add-item");
    // put a type guard here before getting the id of the last object in the array of allListItems
    let newId: number;
    if (typeof allListItems[allListItems.length - 1] === "undefined") {
        newId = 0;
    } else {
        newId = (allListItems[allListItems.length - 1].id as unknown) as number + 1;
    }
    if (inputAdd.value === "") return;
    const newItem: listItem = {
        id: newId,
        onChecked: false,
        item: inputAdd.value,
    }
    addListItem(newItem, allListItems, inputAdd);
});


/*
    The Patch or Put Operation in crud
*/

const updateItem = (id: number, listItemArray: partialListItemType): void => {
    const newListItemArray: partialListItemType = listItemArray.map((listitem) => {
        if (id == listitem.id) {
            // change the text-decoration for the label attached to that input
            const label: HTMLLabelElement = <HTMLLabelElement>document.querySelector(`.label-${id}`);
            if (listitem.onChecked) {
                label.style.removeProperty("text-decoration-line");
            } else {
                label.style.setProperty("text-decoration-line", "line-through");
            }
            return { id: listitem.id, onChecked: !listitem.onChecked, item: listitem.item }
        }
        return listitem;
    });
    localStorage.setItem("listItems", JSON.stringify(newListItemArray));
    // reload the page so that my allListItems can get updated with the new
    // array in the local storage, because the checkbox input type event
    // was set with the previous allListItem
    window.location.reload();
}
/*
    DELETE CRUD OPERATION
*/
const deleteItem = (id: number, listItemArray: partialListItemType): void => {
    const newListItemArray: partialListItemType = listItemArray.filter((listitem) => id !== listitem.id);
    localStorage.setItem("listItems", JSON.stringify(newListItemArray));
    // reload the page so that my allListItems can get updated with the new
    // array in the local storage, because the checkbox input type event
    // was set with the previous allListItem
    window.location.reload();
}

/*
    The Read Operation in CRUD
*/
document.addEventListener("DOMContentLoaded", () => {
    const sThirdDiv: HTMLDivElement = <HTMLDivElement>document.querySelector(".s-third-div");
    allListItems.forEach((listItem) => {
        // creating div for our label and input element

        const divForInpLab: HTMLDivElement = document.createElement("div");
        const label: HTMLLabelElement = document.createElement("label");
        const input: HTMLInputElement = document.createElement("input");
        divForInpLab.setAttribute("class", "div-inplab");
        label.setAttribute("for", (listItem.id as unknown) as string);
        label.setAttribute("class", `label-${listItem.id}`)
        label.classList.add("item-label");
        input.setAttribute("type", "checkbox");
        input.setAttribute("class", "checkbox");
        input.setAttribute("id", (listItem.id as unknown) as string)
        label.textContent = (listItem.item as unknown) as string;
        // check if the listItem was checked
        if (listItem.onChecked === true) {
            label.style.setProperty("text-decoration-line", "line-through");
            input.setAttribute("checked", "checked");
        }
        divForInpLab.append(input, label);

        // now creating a div for google material span element
        const divForSpan: HTMLDivElement = document.createElement("div");
        const span: HTMLSpanElement = document.createElement("span");
        divForSpan.setAttribute("class", "div-span");
        span.setAttribute("class", "material-symbols-outlined");
        span.textContent = "close";
        divForSpan.append(span);

        // div to encompass div for inputlabel and div for span
        const divEncompass: HTMLDivElement = document.createElement("div");
        divEncompass.setAttribute("class", "encompass");
        divEncompass.append(divForInpLab, divForSpan);

        // finally the third div to append div encompass as a child node
        // for every listitem
        sThirdDiv.appendChild(divEncompass);
    })

    /*
        get all checkboxes to run PATCH OR PUT CRUD OPERATION
     */

    const allCheckBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(".checkbox");
    allCheckBoxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
            const checkbox: HTMLInputElement = <HTMLInputElement>event.target
            const clickedInputId: number = parseInt((checkbox.id as unknown) as string);
            updateItem(clickedInputId, allListItems);
        });
    });
    /*
        DELETE CRUD OPERATION
        get all div spans that has a span with close textContent
    */
    const allDeleteDivSpan: NodeListOf<HTMLDivElement> = document.querySelectorAll(".div-span");
    allDeleteDivSpan.forEach((deleteDivSpan) => {
        deleteDivSpan.addEventListener("click", (e) => {
            const deleteDivSpanPreviousSibling: HTMLDivElement = <HTMLDivElement>(<HTMLDivElement>e.currentTarget).previousSibling;
            const listItemId: number = parseInt(((<HTMLInputElement>deleteDivSpanPreviousSibling.querySelector("input")).id as unknown) as string);
            deleteItem(listItemId, allListItems);
        });
    });
});

/*
    DELETE ALL CRUD OPEARTION
*/

const clearAllItems: HTMLDivElement = <HTMLDivElement>document.querySelector(".list-button-div");
clearAllItems.addEventListener("click", () => {
    const newListItemArray: partialListItemType = [];
    localStorage.setItem("listItems", JSON.stringify(newListItemArray));
    window.location.reload();
})