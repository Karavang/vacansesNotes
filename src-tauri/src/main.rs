#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
extern crate webbrowser;

#[derive(Debug, Deserialize, Serialize)]
struct Data {
    link: String,
    motivation: String,
}

#[tauri::command]
fn new_note(link: String, motivation: String) -> Result<bool, tauri::Error> {
    let file_name = "data.json";

    let mut file = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .open(file_name)?;

    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let mut data: Vec<Data> = if contents.is_empty() {
        Vec::new()
    } else {
        serde_json::from_str(&contents)?
    };
    let new_entry = Data { link, motivation };
    data.push(new_entry);

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

    let data: Vec<Data> = if contents.is_empty() {
        Vec::new()
    } else {
        serde_json::from_str(&contents)?
    };

    let count = data.len();

    Ok(count)
}

#[tauri::command]
fn contains_text(search_text: &str) -> Result<bool, tauri::Error> {
    let file_name = "data.json";

    let mut file = File::open(file_name)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let data: Vec<Data> = if contents.is_empty() {
        Vec::new()
    } else {
        serde_json::from_str(&contents)?
    };

    let contains = data
        .iter()
        .any(|item| item.link.contains(search_text) || item.motivation.contains(search_text));

    Ok(contains)
}

#[tauri::command]
fn list_text() -> Result<Vec<Data>, tauri::Error> {
    let file_name = "data.json";

    let mut file = File::open(file_name)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let data: Vec<Data> = if contents.is_empty() {
        Vec::new()
    } else {
        serde_json::from_str(&contents)?
    };

    Ok(data)
}

#[tauri::command]
async fn redirection(link: &str) -> Result<(), tauri::Error> {
    println!("{}", link);
    webbrowser::open(link)?;
    Ok(())
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            new_note,
            count_elements,
            contains_text,
            list_text,
            redirection
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
