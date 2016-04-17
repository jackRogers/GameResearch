﻿using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class GameController : MonoBehaviour {
    
    public GameObject hazard;
    public Vector3 spawnValues;
    public int hazardCount;
    public float spawnWait;
    public float spawnRate;
    public float startWait;
    public float waveWait;

    public Text restartText;
    public Text gameOverText;
    private bool  gameOver;
    private bool restart;

    public Text scoreText;
    private int score;

        
	// Use this for initialization
	void Start () 
    {
        gameOver = false;
        restart = false;
        restartText.text = "";
        gameOverText.text = "";
            
         
        score = 0;
        UpdateScore();
        StartCoroutine( SpawnWaves () );
	}

    void Update(){
        if (restart)
        {
            if (Input.GetKeyDown(KeyCode.R))
            {
                Application.LoadLevel(Application.loadedLevel);
            }
        }
    }

    IEnumerator SpawnWaves() {
        yield return new WaitForSeconds(startWait);
        while (true){
            for (int i = 0; i < hazardCount; i++){
                Vector3 spawnPosition = new Vector3(Random.Range(-spawnValues.x,spawnValues.x),spawnValues.y,spawnValues.z);
                Quaternion spawnRotation = Quaternion.identity;
                Instantiate(hazard, spawnPosition, spawnRotation);
                yield return new WaitForSeconds(spawnWait);
            }
            yield return new WaitForSeconds(waveWait);

            if (gameOver)
            {
                restartText.text = "Press 'R' for Restart";
                restart = true;
                break;
            }
        }
    }

    public void AddScore(int newScoreValue){
        score += newScoreValue;
        UpdateScore();
    }
	
	// Update is called once per frame
	void UpdateScore () 
    {
        scoreText.text = "Score: " + score;    
	
	}

    public void GameOver()
    {
        gameOverText.text = "FUCK SHIT YOU LOST";
        gameOver = true;
    }

}
