package hu.nemaberci.solution.util

import org.slf4j.LoggerFactory

class TryAgainUtil {

    companion object {

        fun <T: Any> tryMultiple(times: Int = 10, sleepMillis: Long = 1000L, callback: () -> T): T? {

            val logger = LoggerFactory.getLogger(TryAgainUtil::class.java)

            for (i in 0..times) {

                try {
                    return callback();
                } catch (e: Exception) {
                    logger.error("Callback threw exception, trying again in $sleepMillis millis")
                    Thread.sleep(sleepMillis)
                }

            }

            return null;

        }

        fun <T: Any> tryInfinitely(sleepMillis: Long = 1000L, callback: () -> T): T {

            val logger = LoggerFactory.getLogger(TryAgainUtil::class.java)

            while (true) {

                try {
                    return callback()
                } catch (e: Exception) {
                    logger.error("Callback threw exception, trying again in $sleepMillis millis")
                    Thread.sleep(sleepMillis)
                }

            }

        }

    }

}