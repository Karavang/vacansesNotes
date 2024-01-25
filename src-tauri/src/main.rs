#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
#[tauri::command]
fn new_note(link: String) -> Result<bool, std::io::Error> {
    let file_name = "data.txt";

    let mut file = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .append(true)
        .open(file_name)?;

    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    contents.push_str(&link);

    file.write_all(contents.as_bytes())?;

    Ok(true)
}
#[tauri::command]
fn count_elements() -> Result<usize, std::io::Error> {
    let file_name = "data.txt";

    let mut file = File::open(file_name)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let elements: Vec<&str> = contents.lines().collect();
    let count = elements.len();

    println!("Number of elements in the array: {}", count);

    Ok(count)
}
#[tauri::command]
fn contains_text(search_text: &str) -> Result<bool, std::io::Error> {
    let file_name = "data.txt";

    let mut file = File::open(file_name)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let elements: Vec<&str> = contents.lines().collect();
    let contains = elements.contains(&search_text);

    Ok(contains)
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            new_note as fn(String) -> Result<bool, std::io::Error>,
            count_elements as fn() -> Result<usize, std::io::Error>,
            contains_text as fn(&str) -> Result<bool, std::io::Error>
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
