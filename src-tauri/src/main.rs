#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};

#[derive(Debug, Deserialize, Serialize)]
struct Data {
    links: Vec<String>,
}

#[tauri::command]
fn new_note(link: String) -> Result<bool, tauri::Error> {
    let file_name = "data.json";

    let mut file = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .open(file_name)?;

    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let mut data: Data = if contents.is_empty() {
        Data { links: Vec::new() }
    } else {
        serde_json::from_str(&contents)?
    };

    data.links.push(link);

    let serialized_data = serde_json::to_string(&data)?;

    let mut file = File::create(file_name)?;
    file.write_all(serialized_data.as_bytes())?;

    Ok(true)
}

#[tauri::command]
fn count_elements() -> Result<usize, tauri::Error> {
    let file_name = "data.json";

    let mut file = File::open(file_name)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let data: Data = if contents.is_empty() {
        Data { links: Vec::new() }
    } else {
        serde_json::from_str(&contents)?
    };

    let count = data.links.len();

    Ok(count)
}

#[tauri::command]
fn contains_text(search_text: &str) -> Result<bool, tauri::Error> {
    let file_name = "data.json";

    let mut file = File::open(file_name)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let data: Data = if contents.is_empty() {
        Data { links: Vec::new() }
    } else {
        serde_json::from_str(&contents)?
    };

    let contains = data.links.contains(&search_text.to_string());

    Ok(contains)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            new_note,
            count_elements,
            contains_text
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
