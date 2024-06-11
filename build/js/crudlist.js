"use strict";
// get all listItems stored in the local storage
const localStorageValue = localStorage.getItem("listItems");
const allListItems = JSON.parse(localStorageValue) || [];
/*
    The CREATE OPERATION in CRUD
    get the span element and put an event listener
    such that a click on it would run the addListItem
    function.
*/
const spanToAdd = document.querySelector(".span-to-add");
const inputAdd = document.getElementById("add-item");
const addListItem = (item, listItemArray, inputElement) => {
    const newListItemArray = [...listItemArray, item];
    localStorage.setItem("listItems", JSON.stringify(newListItemArray));
    window.location.reload();
    inputElement.focus();
};
inputAdd.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
        // put a type guard here before getting the id of the last object in the array of allListItems
        let newId;
        if (typeof allListItems[allListItems.length - 1] === "undefined") {
            newId = 0;
        }
        else {
            newId = allListItems[allListItems.length - 1].id + 1;
        }
        if (inputAdd.value === "")
            return;
        const newItem = {
            id: newId,
            onChecked: false,
            item: inputAdd.value,
        };
        addListItem(newItem, allListItems, inputAdd);
    }
});
spanToAdd.addEventListener("click", (e) => {
    console.log(e.currentTarget);
    // get the input element
    const inputAdd = document.getElementById("add-item");
    // put a type guard here before getting the id of the last object in the array of allListItems
    let newId;
    if (typeof allListItems[allListItems.length - 1] === "undefined") {
        newId = 0;
    }
    else {
        newId = allListItems[allListItems.length - 1].id + 1;
    }
    if (inputAdd.value === "")
        return;
    const newItem = {
        id: newId,
        onChecked: false,
        item: inputAdd.value,
    };
    addListItem(newItem, allListItems, inputAdd);
});
/*
    The Patch or Put Operation in crud
*/
const updateItem = (id, listItemArray) => {
    const newListItemArray = listItemArray.map((listitem) => {
        if (id == listitem.id) {
            // change the text-decoration for the label attached to that input
            const label = document.querySelector(`.label-${id}`);
            if (listitem.onChecked) {
                label.style.removeProperty("text-decoration-line");
            }
            else {
                label.style.setProperty("text-decoration-line", "line-through");
            }
            return { id: listitem.id, onChecked: !listitem.onChecked, item: listitem.item };
        }
        return listitem;
    });
    localStorage.setItem("listItems", JSON.stringify(newListItemArray));
    // reload the page so that my allListItems can get updated with the new
    // array in the local storage, because the checkbox input type event
    // was set with the previous allListItem
    window.location.reload();
};
/*
    DELETE CRUD OPERATION
*/
const deleteItem = (id, listItemArray) => {
    const newListItemArray = listItemArray.filter((listitem) => id !== listitem.id);
    localStorage.setItem("listItems", JSON.stringify(newListItemArray));
    // reload the page so that my allListItems can get updated with the new
    // array in the local storage, because the checkbox input type event
    // was set with the previous allListItem
    window.location.reload();
};
/*
    The Read Operation in CRUD
*/
document.addEventListener("DOMContentLoaded", () => {
    const sThirdDiv = document.querySelector(".s-third-div");
    allListItems.forEach((listItem) => {
        // creating div for our label and input element
        const divForInpLab = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        divForInpLab.setAttribute("class", "div-inplab");
        label.setAttribute("for", listItem.id);
        label.setAttribute("class", `label-${listItem.id}`);
        label.classList.add("item-label");
        input.setAttribute("type", "checkbox");
        input.setAttribute("class", "checkbox");
        input.setAttribute("id", listItem.id);
        label.textContent = listItem.item;
        // check if the listItem was checked
        if (listItem.onChecked === true) {
            label.style.setProperty("text-decoration-line", "line-through");
            input.setAttribute("checked", "checked");
        }
        divForInpLab.append(input, label);
        // now creating a div for google material span element
        const divForSpan = document.createElement("div");
        const span = document.createElement("span");
        divForSpan.setAttribute("class", "div-span");
        span.setAttribute("class", "material-symbols-outlined");
        span.textContent = "close";
        divForSpan.append(span);
        // div to encompass div for inputlabel and div for span
        const divEncompass = document.createElement("div");
        divEncompass.setAttribute("class", "encompass");
        divEncompass.append(divForInpLab, divForSpan);
        // finally the third div to append div encompass as a child node
        // for every listitem
        sThirdDiv.appendChild(divEncompass);
    });
    /*
        get all checkboxes to run PATCH OR PUT CRUD OPERATION
     */
    const allCheckBoxes = document.querySelectorAll(".checkbox");
    allCheckBoxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
            const checkbox = event.target;
            const clickedInputId = parseInt(checkbox.id);
            updateItem(clickedInputId, allListItems);
        });
    });
    /*
        DELETE CRUD OPERATION
        get all div spans that has a span with close textContent
    */
    const allDeleteDivSpan = document.querySelectorAll(".div-span");
    allDeleteDivSpan.forEach((deleteDivSpan) => {
        deleteDivSpan.addEventListener("click", (e) => {
            const deleteDivSpanPreviousSibling = e.currentTarget.previousSibling;
            const listItemId = parseInt(deleteDivSpanPreviousSibling.querySelector("input").id);
            deleteItem(listItemId, allListItems);
        });
    });
});
/*
    DELETE ALL CRUD OPEARTION
*/
const clearAllItems = document.querySelector(".list-button-div");
clearAllItems.addEventListener("click", () => {
    const newListItemArray = [];
    localStorage.setItem("listItems", JSON.stringify(newListItemArray));
    window.location.reload();
});
