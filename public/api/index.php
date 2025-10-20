<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

define('APP_ROOT', realpath(dirname(dirname(dirname(__FILE__)))));

// Set up our database
$pdo = new PDO('sqlite:'.APP_ROOT.'/database/sqlite.db');
$pdo->prepare("CREATE TABLE IF NOT EXISTS user (username TEXT)")->execute();
$pdo->prepare("CREATE TABLE IF NOT EXISTS todo (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, item TEXT, done INTEGER)")->execute();

$response = [
	'has_error' => false,
	'message' => '',
	'data' => []
];

$in = parse_input();

switch($in->action){

	// The issue is happening because here, we have a "Not Implemented" error firing every time we press the delete button.
	// So, the solution is to implement our 'delete_todo' case so that our back end deletes the todo.
	case 'delete_todo':
		// Lets validate our input first
		$rawID = getInput('id', true);
		$id = filter_var($rawID, FILTER_VALIDATE_INT);
		if(!$id){
			error('Invalid ID.');
			break;
		}
		try {
			// Here we are going to prepare an sql statement that we will execute, afterwards we will replace our "id= ?" with a proper id, which is coming from react via response
			$stmt = $pdo->prepare('DELETE FROM todo WHERE id= ?');
			$stmt->execute ([$id]);

			if ($stmt->rowCount() === 0){
				// Deletion did not happen - possibly already hone or bad ID
				error("Todo not found.");
				break;

			}
			// Success!
			$response['data'] = ['deleted' => $stmt->rowCount() > 0];
		} catch (Throwable $e) {
			error('Failed to delete item.');
		}	
		// error('Not implemented.');
		break;

	case 'toggle_done':
		$id = getInput('id', true);
		$stmt = $pdo->prepare("SELECT done FROM todo WHERE id = ?");
		$stmt->execute([$id]);
		$done = $stmt->fetchColumn();
		$pdo->prepare("UPDATE todo SET done = ? WHERE id = ?")->execute([$done == '1' ? '0' : '1', $id]);
		break;

	case 'edit_todo':
		$item = getInput('item', true);
		$id = getInput('id', true);
		$pdo->prepare("UPDATE todo SET item = ? WHERE id = ?")->execute([$item, $id]);
		break;

	case 'add_item':
		$item = getInput('item', true);
		$pdo->prepare("INSERT INTO todo (item, done) VALUES (?, 0)")->execute([$item]);
		$id = $pdo->query("SELECT MAX(id) FROM todo")->fetchColumn(); 
		$response['data'] = [
			'id' => $id
		];
		break;

	case 'get_todos':
		$stmt = $pdo->prepare("SELECT * FROM todo");
		$stmt->execute();
		$response['data'] = [
			'items' => $stmt->fetchAll(PDO::FETCH_ASSOC)
		];
		break;

	case 'set_name':
		$name = getInput('name', true);

		// Check if a row exists yett
		$exists = $pdo->query("SELECT COUNT(1) FROM user")->fetchColumn();
		
		// Update or insert accordingly
		if(intval($exists) === 0){
			$success = $pdo->prepare("INSERT INTO user (username) VALUES (?)")->execute([$name]);
		}else{
			$success = $pdo->prepare("UPDATE user SET username = ?")->execute([$name]);
		}

		if(!$success) error("Unable to update username");
		break;

	case 'get_name':
		$stmt = $pdo->prepare("SELECT username FROM user");
		$stmt->execute();
		$response['data'] = [
			'username' => $stmt->fetchColumn()
		];
		break;

	default:
		error('Invalid action.');
}

output();

function getInput($key, $required=false, $default=null){
	if($required && !property_exists($GLOBALS['in'], $key)) error('Required input missing: '.$key);
	return property_exists($GLOBALS['in'], $key) ? $GLOBALS['in']->$key : $default;
}

function output(){
	header('Content-Type: application/json');
	echo json_encode($GLOBALS['response']);
	exit;
}

function error($message){
	$GLOBALS['response']['has_error'] = true;
	$GLOBALS['response']['message'] = $message;
	output();
}

function parse_input(){
	// Accepts JSON formatted input
	$post_body = file_get_contents('php://input');
	if(empty($post_body)) error('Missing post body.');
	$in = json_decode($post_body);
	if(empty($in) || empty($in->action)) error('Invalid post body.');
	return $in;
}
