import styles from '../../styles/Items.module.css'

export default function CheckboxWithLabel(data) {
    return (
        <div className={styles.checkboxWithLabel}>
            <input type="checkbox" onChange={data.onChange ? data.onChange : undefined} id={data.name.toLowerCase()} name={data.name.toLowerCase()} defaultChecked={data.checked} />
            <label htmlFor={data.name.toLowerCase()}>{data.name}</label>
        </div>
    )
}