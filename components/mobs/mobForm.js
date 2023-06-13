import styles from '../../styles/Items.module.css'
import React from 'react'
import TranslatableText from '../translatableText'

const checkboxLongTouch = {
    timer: 0,
    duration: 500
}

function getResetKey(name) {
    return name + new Date()
}

export default function MobForm({ update, mobData }) {
    const [searchKey, setSearchKey] = React.useState(getResetKey("search"))
    const form = React.useRef()

    function sendUpdate(event = {}) {
        if (event.type === "submit") {
            event.preventDefault()
        }
        update(Object.fromEntries(new FormData(form.current).entries()));
    }

    function disableRightClick(event) {
        event.preventDefault()
    }

    function resetForm() {
        // Giving a new key to an element recreates it from scratch. It is used as a workaround to reset a component that doesn't reset on its own
    }

    function uncheckOthers(event) {
        // Selects the checkbox given that you clicked the label or checkbox
        let interestingElement = event.target.parentElement.firstChild;
        if (interestingElement.type != "checkbox") {
            interestingElement = event.target.firstChild;
        }
        if (interestingElement && interestingElement.type == "checkbox") {
            if (event.button == 2) {
                event.preventDefault()
                interestingElement.checked = true;
                for (const group of interestingElement.parentElement.parentElement.parentElement.children) {
                    for (const checkboxHolder of group.children) {
                        if (checkboxHolder.firstChild.id != interestingElement.id) {
                            checkboxHolder.firstChild.checked = false;
                        }
                    }
                }
            } else if (event.button == 0 && event.target.localName == "div") {
                // Makes it so that you check/uncheck the checkbox even if you click the div that the checkbox is in and not directly on the checkbox
                interestingElement.checked = !interestingElement.checked;
            }
        }
    }

    function uncheckOthersLongTouch(event) {
        // Selects the checkbox given that you clicked the label or checkbox
        let interestingElement = event.target.parentElement.firstChild;
        if (interestingElement.type != "checkbox") {
            interestingElement = event.target.firstChild;
        }
        console.log(event.target.localName);
        if (interestingElement && (interestingElement.type == "checkbox" || event.target.localName == "div")) {
            checkboxLongTouch.timer = setTimeout(() => {
                interestingElement.checked = true;
                for (const group of interestingElement.parentElement.parentElement.parentElement.children) {
                    for (const checkboxHolder of group.children) {
                        if (checkboxHolder.firstChild.id != interestingElement.id) {
                            checkboxHolder.firstChild.checked = false;
                        }
                    }
                }
            }, checkboxLongTouch.duration);
        } else if (event.target.localName == "div") {
            interestingElement.checked = !interestingElement.checked;
        }
    }

    function clearLongTouch() {
        if (checkboxLongTouch.timer) {
            clearTimeout(checkboxLongTouch.timer);
        }
    }

    return (
        <form onSubmit={sendUpdate} onReset={resetForm} onContextMenu={disableRightClick} onMouseDown={uncheckOthers} onTouchStart={uncheckOthersLongTouch} onTouchEnd={clearLongTouch} ref={form} className={styles.searchForm}>
            <TranslatableText identifier="items.searchForm.search"></TranslatableText>
            <input type="text" name="searchName" placeholder="Search Name" />
            <div>
                <input className={styles.submitButton} type="submit" />
                <input className={styles.warningButton} type="reset" />
            </div>
        </form>
    )
}