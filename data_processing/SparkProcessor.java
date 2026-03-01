package com.vidyavaani.analytics;

import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.SparkSession;
import java.util.Arrays;

public class SparkProcessor {

    public static void main(String[] args) {
        SparkSession spark = SparkSession
                .builder()
                .appName("VidyaVaaniAnalytics")
                .config("spark.master", "local[*]")
                .getOrCreate();

        JavaSparkContext jsc = new JavaSparkContext(spark.sparkContext());

        JavaRDD<String> logData = jsc.textFile("hdfs://namenode:8020/user/hadoop/vidyavaani/logs/*.txt");
        
        long errorCount = logData.filter(line -> line.contains("ERROR")).count();
        long warningCount = logData.filter(line -> line.contains("WARN")).count();

        System.out.println("Analytics Summary:");
        System.out.println("Total Error Logs: " + errorCount);
        System.out.println("Total Warning Logs: " + warningCount);

        spark.stop();
    }
}
